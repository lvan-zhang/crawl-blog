const superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

/**
 * 爬取csdn博客的类
 * @class Csdn
 * @constructor
 * @param id weixin_43972437
 * @param month 2020/1
 * @param cookie
 */
class Csdn {
  constructor (params) {
    this.id = params.id
    this.month = params.month
    this.cookie = params.cookie
    this.path = params.path
    this.prefix = params.prefix
    this.newPrefix = ''
    this.orgBlogNum = 0
    this.crawlBlogNum = 0
  }
  pathJoin = (name) => {
    return path.join(this.path, name)
  }
  getBlogInfo = (url) => {
    let self = this
    // https://blog.csdn.net/weixin_43972437/article/month/2019/11/2 最后的 2
    let page = 2
    superagent.get(url).then(res => {
      const $ = cheerio.load(res.text)
      let tail = 0

      // 全部爬取
      if (url.split('/').length === 4) {
        // 获取月数
        $('#asideArchive .archive-list li').each((index, element) => {
          let dateUrl = $(element).children('a').attr('href')
          // 循环解析每一个月
          self.getBlogInfo(dateUrl)
          // 得到例如：2020/01
          // dateUrl.slice(dateUrl.length - 7)
        })
      }
  
      // 爬取某一个月
      $('.article-list .article-item-box').each((index, element) => {
        // 得到例如：https://blog.csdn.net/weixin_43972437/article/details/103658695
        let id = $(element).children('h4').children('a').attr('href')
                  // 得到例如：103658695
                  .split('/').pop()
        // 得到例如：2020-01-16 16:51:11
        let date = $(element).children('.align-content-center').find('.date').text()
                    // 得到例如：2020-01-16
                    .trim().slice(0, 10)
        // 得到例如：20200116
        let fileName = date.split('-').join('')
                        + 
                        // 得到例如：2020011601
                        (tail < 10 ? '0' : '') + tail
        tail++
        self.dealBlog(id, fileName, date)
      })
      // 如果有分页的话
      let listLength = $('.article-list .article-item-box').length
      // 原本有多少个博客
      this.orgBlogNum += listLength

      if (listLength === 40) {
        self.getBlogInfo(url + '/' + page)
        page++
        return false
      }
      page = 2
    })
  }
  dealBlog = async (id, fileName, date) => {
    let url = 'https://mp.csdn.net/mdeditor/getArticle?id=' + id
    const res = await superagent
          .get(url)
          .set('Cookie', this.cookie)
          .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36')
    let resTitle = res.body.data.title
    let resTags = res.body.data.tags
    let resCategories = res.body.data.categories
    let resDescription = res.body.data.description
    let resMarkdowncontent = res.body.data.markdowncontent
    // 正则找 {{}} ,拿到一个数组
    const reg = /\{\{(.+?)\}\}/g
    
    if (res.body.status) {
      if (this.prefix) {
        let regArray = this.prefix.match(reg)
        // 每次操作this.newPrefix，不污染this.prefix
        this.newPrefix = this.prefix
        for (let i = 0;i < regArray.length;i++) {
          let replaceData = ''
          switch (regArray[i]) {
            case '{{title}}':
              replaceData = resTitle
              break
            case '{{date}}':
              replaceData = date
              break
            case '{{tags}}':
              replaceData = resTags
              break
            case '{{categories}}':
              replaceData = resCategories
              break
            case '{{description}}':
              replaceData = resDescription
              break
          }
          // 拿到解析后的前缀
          this.newPrefix = this.newPrefix.replace(regArray[i], replaceData)
        }
      }

      // 是否有分类这个文件夹
      let exists = fs.existsSync(this.pathJoin(resCategories))
      // 没有的话创建一个
      if (!exists) {
        fs.mkdirSync(this.pathJoin(resCategories));
      }
      // 是否有分类/2020这个文件夹
      let exists1 = fs.existsSync(this.pathJoin(resCategories + '/' + fileName.slice(0, 4)))
      // 没有的话创建一个
      if (!exists1) {
        fs.mkdirSync(this.pathJoin(resCategories + '/' + fileName.slice(0, 4)));
      }
      // 写入博客
      fs.writeFile(this.pathJoin(resCategories + '/' + fileName.slice(0, 4) + '/' + fileName.slice(4) + '.md'),
      this.newPrefix + resMarkdowncontent,
      (err) => {
        if (err) throw err;
        this.crawlBlogNum++
        // console.log(`${fileName.slice(4)}.md文件已被保存`);
        console.log(`正在爬取第${this.crawlBlogNum}个博客,文件名：${fileName.slice(4)}.md`)
        if (this.crawlBlogNum >= this.orgBlogNum) {
          console.log(`\n本次检测到有${this.orgBlogNum}个博客,成功爬取${this.crawlBlogNum}个，快去目录${this.path}看看吧`)
        }
      });
    } else {
      console.log(res.body.error)
    }
  }
  start = () => {
    // 爬取某个月
    if (this.month) {
      this.getBlogInfo(`https://blog.csdn.net/${this.id}/article/month/${this.month}`)
    } else {
      // 爬取全部
      this.getBlogInfo(`https://blog.csdn.net/${this.id}`)
    }
  }
};
module.exports = Csdn
