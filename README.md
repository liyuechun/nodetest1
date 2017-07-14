# 60分钟学会使用Node.js+Express+Ejs+mongoDB

>本文出自从零到壹全栈部落

## 第1部分 – 15分钟安装

本文改编自[THE DEAD-SIMPLE STEP-BY-STEP GUIDE FOR FRONT-END DEVELOPERS TO GETTING UP AND RUNNING WITH NODE.JS, EXPRESS, JADE, AND MONGODB](http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/)

- 第1步 - 环境安装

请直接移步[Node.js官网](https://nodejs.org/en/),如下图所示，直接点击最新版下载并进行安装。
![](http://osazvg3ch.bkt.clouddn.com/nodejs.png)

Node.js安装完毕后，打开终端，在终端分别输入如下命令，检测是否安装成功。

```js
Last login: Tue Jun 27 09:19:38 on console
liyuechun:~ yuechunli$ node -v
v8.1.3
liyuechun:~ yuechunli$ npm -v
5.0.3
liyuechun:~ yuechunli$ 
```

如果能够正确显示node和npm的版本，说明Node.js安装成功。

- 第2步 - 安装Express

```js
Last login: Mon Jul 10 11:14:16 on ttys001
liyuechun:~ yuechunli$ npm install -g express
+ express@4.15.3
added 42 packages in 7.337s
liyuechun:~ yuechunli$ 
```

- 第3步 - 创建一个Express项目

我们准备使用`Express`和`Ejs`，这不是用来做CSS预处理的。我们会手写一些CSS。我们要用Ejs或者其它的模板引擎来处理Node和Express的数据。如果你会HTML的话，Ejs并不难。只要记住你需要集中精神，否则很容易出错。

```js
liyuechun:Desktop yuechunli$ pwd
/Users/liyuechun/Desktop
liyuechun:Desktop yuechunli$ mkdir 60MINUTES
liyuechun:Desktop yuechunli$ cd 60MINUTES/
bogon:60MINUTES yuechunli$ express -e nodetest1

  warning: option `--ejs' has been renamed to `--view=ejs'


   create : nodetest1
   create : nodetest1/package.json
   create : nodetest1/app.js
   create : nodetest1/public
   create : nodetest1/views
   create : nodetest1/views/index.ejs
   create : nodetest1/views/error.ejs
   create : nodetest1/routes
   create : nodetest1/routes/index.js
   create : nodetest1/routes/users.js
   create : nodetest1/bin
   create : nodetest1/bin/www
   create : nodetest1/public/javascripts
   create : nodetest1/public/stylesheets
   create : nodetest1/public/stylesheets/style.css

   install dependencies:
     $ cd nodetest1 && npm install

   run the app:
     $ DEBUG=nodetest1:* npm start

   create : nodetest1/public/images
bogon:60MINUTES yuechunli$ 
```

VSCode打开，项目结构如下：

![](http://oswrtif8l.bkt.clouddn.com/WechatIMG140.jpeg)

- 第4步 - 编辑依赖项

好了，我们现在有一些基本项目结构，但是还没完。你会注意到express的安装过程在你的nodetest1目录里创建了一个叫`package.json`的文件，用文本编辑器打开这个文件，它应该是长这样的:

```js
{
  "name": "nodetest1",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "body-parser": "~1.17.1",
    "cookie-parser": "~1.4.3",
    "debug": "~2.6.3",
    "ejs": "~2.5.6",
    "express": "~4.15.2",
    "morgan": "~1.8.1",
    "serve-favicon": "~2.4.2"
  }
}
```

这是一个标准的JSON格式文件，表明了我们应用的依赖。我们需要添加一点东西。比如对mongodb和Monk的调用。把dependencies部分改成这样：

```js
{
  "name": "nodetest1",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "body-parser": "~1.17.1",
    "cookie-parser": "~1.4.3",
    "debug": "~2.6.3",
    "ejs": "~2.5.6",
    "express": "~4.15.2",
    "morgan": "~1.8.1",
    "serve-favicon": "~2.4.2",
    "mongodb": "*",
    "monk": "*"
  }
}
```

- 第5步 – 安装依赖

现在我们定义好了项目的依赖项。*号会告诉NPM“安装最新版本”。回到命令行窗口，进入nodetest1目录，输入：

```js
bogon:nodetest1 yuechunli$ ls
app.js          package.json    routes
bin             public          views
bogon:nodetest1 yuechunli$ npm install
npm notice created a lockfile as package-lock.json. You should commit this file.
added 80 packages in 4.563s
bogon:nodetest1 yuechunli$ npm start

> nodetest1@0.0.0 start /Users/liyuechun/Desktop/60MINUTES/nodetest1
> node ./bin/www

Express server listening on port 3000...
GET / 200 13.288 ms - 207
GET /stylesheets/style.css 200 3.295 ms - 111
GET /favicon.ico 404 1.757 ms - 1136
```

浏览器输入`http://127.0.0.1:3000`,效果图如下：

![](http://oswrtif8l.bkt.clouddn.com/WechatIMG141.jpeg)

## 第2部分 – 好了，我们来写“Hello, World!”吧

- 查阅`app.js`源码

```js
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log("Express server listening on port 3000...");

module.exports = app;
```

- `app.js`中添加代码

现在，我们写点有用的。我们不会直接在我们的index页面里写“Hello World!”，我们借这个机会学习一下如何使用route路由，同时学习一下Ejs引擎是如何工作的。在上面的app.js文件中添加**`如下`**两行代码：

![](http://oswrtif8l.bkt.clouddn.com/WechatIMG144.jpeg)

- 创建`helloworld.js`文件

![](http://oswrtif8l.bkt.clouddn.com/WechatIMG145.jpeg)

内容如下：

```js
var express = require('express');
var router = express.Router();

/* GET HelloWorld page. */
router.get('/', function(req, res, next) {
  res.render('helloworld', { title: 'HelloWorld' });
});

module.exports = router;
```

- 创建`helloworld.ejs`文件

![](http://oswrtif8l.bkt.clouddn.com/WechatIMG146.jpeg)

内容如下：

```js
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1><%= title %></h1>
  </body>
</html>
```


- 运行程序
`npm start`启动服务器,然后在浏览器打开`http://localhost:3000/helloworld`,应该能看到这个漂亮的界面了：
![](http://oswrtif8l.bkt.clouddn.com/WechatIMG147.jpeg)

- ejs⚠️去除

![](http://oswrtif8l.bkt.clouddn.com/WechatIMG148.jpeg)

如上图所示，在VSCode中使用`ejs`代码会出现语法不识别的问题，启动VSCode，通过快捷键`⌘+P`快速打开窗口，将如下代码拷贝粘贴到里面，回车安装插件，然后重启即可。

```js
ext install ejs-language-support
```

[EJS Language Support](https://github.com/gregory-m/ejs-tmbundle)

|扫码申请加入全栈部落|
|:---------------:|
|![](http://upload-images.jianshu.io/upload_images/75699-a5d38be84e4eac70.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)|

## 第3部分 – 创建数据库并读取数据

- 第1步 - 更新HomeBrew

```js
Last login: Wed Jul 12 09:27:06 on ttys000
liyuechun:~ yuechunli$ brew update
Updated 1 tap (homebrew/core).
==> Updated Formulae
radare2
```

- 第2步 – 安装Mongodb

```js
liyuechun:~ yuechunli$ brew install mongodb
==> Downloading https://homebrew.bintray.com/bottles/mongodb-3.4.6.sierra.bottle
Already downloaded: /Users/liyuechun/Library/Caches/Homebrew/mongodb-3.4.6.sierra.bottle.tar.gz
==> Pouring mongodb-3.4.6.sierra.bottle.tar.gz
==> Using the sandbox
==> Caveats
To have launchd start mongodb now and restart at login:
  brew services start mongodb
Or, if you don't want/need a background service you can just run:
  mongod --config /usr/local/etc/mongod.conf
==> Summary
🍺  /usr/local/Cellar/mongodb/3.4.6: 18 files, 266.9MB
```

- 第3步 - 配置环境环境变量

```js
liyuechun:~ yuechunli$ echo 'export PATH="/usr/local/opt/openssl/bin:$PATH"' >> ~/.bash_profile
```

- 第4步 - 创建数据库路径

```js
liyuechun:~ yuechunli$ mkdir -p /data/db
```


- 第5步 - 启动MongoDb（安装成功后命令行有提示）

```js
liyuechun:~ yuechunli$ mongod --config /usr/local/etc/mongod.conf
```

- 第6步 - 连接到mongo

```js
Last login: Wed Jul 12 11:00:21 on ttys000
liyuechun:~ yuechunli$ mongo
MongoDB shell version v3.4.6
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.4.6
> 1+1
2
> 
```

- 第7步 - 浏览器访问`http://127.0.0.1:27017/`

![](http://oswrtif8l.bkt.clouddn.com/WechatIMG149.jpeg)

- 第8步 - 创建数据库

`use nodetest1`这个命令，只有我们插入数据时，才会真正创建数据库。

```js
Last login: Wed Jul 12 11:35:52 on ttys001
liyuechun:~ yuechunli$ mongo
MongoDB shell version v3.4.6
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.4.6
> use nodetest1
switched to db nodetest1
> 
```

- 第9步 - 添加一些数据

我最喜欢的MongoDB的特性就是它使用JSON作为数据结构，这就意味着我们对此非常的熟悉。如果你不熟悉JSON，先去读点相关资料吧，这超出了本教程的范围。

我们添加一些数据到collection中。在这个教程里，我们只有一个简单的数据库，username和email两个字段。我们的数据看起来是这个样子的：

```js
{
    "_id" : 1234,
    "username" : "liyuechun",
    "email" : "liyuechun@cldy.org"
}
```
你可以创建你自己的_id字段的值，不过我觉得最好还是让mongo来做这件事。它会为每一条记录创建一个唯一的值。我们看看它是怎么工作的。在mongo的窗口中，输入：

```js
> db.usercollection.insert({"username" : "liyuechun", "email" : "liyuechun@cldy.org" })
WriteResult({ "nInserted" : 1 })
>
```

**重要提示**：db就是我们上面创建的`nodetest1`数据库，就是我们的`collection`，相当于一张数据表。注意我们不需要提前创建这个`collection`，它会在第一次使用的时候自动创建。好了，按下回车。

- 第10步 - 数据库查询

```js
> db.usercollection.find().pretty()
{
	"_id" : ObjectId("59659d8fbd3dbae3899471c2"),
	"username" : "liyuechun",
	"email" : "liyuechun@cldy.org"
}
> 
```

当然，你得到ObjectID应该是不一样的，mongo会自动生成一个。如果你以前使用过JSON接口的服务，现在是不是会觉得，哇，在web里调用这个应该很简单吧！嗯，你说对了。

提示：作为正式服务，你应该不希望所有的数据都存在最顶层。关于mongodb数据结构的设计，多看看Google吧。

现在我们有了一条数据，我们多添加点吧。

```js
> db.usercollection.insert(
[
    {"username":"yanan","email":"yanan@cldy.org"},
    {"username":"fujinliang","email":"fujinliang@cldy.org"},
    {"username":"shenpingping","email":"shenpingping@cldy.org"}
])
BulkWriteResult({
	"writeErrors" : [ ],
	"writeConcernErrors" : [ ],
	"nInserted" : 3,
	"nUpserted" : 0,
	"nMatched" : 0,
	"nModified" : 0,
	"nRemoved" : 0,
	"upserted" : [ ]
})
> db.usercollection.find().pretty()
{
	"_id" : ObjectId("59659d8fbd3dbae3899471c2"),
	"username" : "liyuechun",
	"email" : "liyuechun@cldy.org"
}
{
	"_id" : ObjectId("59659ffebd3dbae3899471c3"),
	"username" : "yanan",
	"email" : "yanan@cldy.org"
}
{
	"_id" : ObjectId("59659ffebd3dbae3899471c4"),
	"username" : "fujinliang",
	"email" : "fujinliang@cldy.org"
}
{
	"_id" : ObjectId("59659ffebd3dbae3899471c5"),
	"username" : "shenpingping",
	"email" : "shenpingping@cldy.org"
}
>
```

第11步 – 把mongo连接到node

现在我们来建立一个页面，把数据库里的记录显示成一个漂亮的表格。这是我们准备生成的HTML内容：

```js
<ul>
    <li><a href="mailto:liyuechun@cldy.org">liyuechun</a></li>
    <li><a href="mailto:yanan@testdomain.com">yanan</a></li>
    <li><a href="mailto:fujinliang@testdomain.com">fujinliang</a></li>
    <li><a href="mailto:shenpingping@testdomain.com">shenpingping</a></li>
</ul>
```

打开`nodetest1`项目的`app.js`，现在接着往下看：

```js
var index = require('./routes/index');
var users = require('./routes/users');
var helloworld = require('./routes/helloworld');
```

下面添加一行：

```js
var userlist = require('./routes/userlist');
```

继续，找到下面代码的位置：

```js
app.use('/', index);
app.use('/users', users);
app.use('/helloworld', helloworld);
```

下面添加一行：

```js
app.use('/userlist', userlist);
```

第12步 – 创建 `userlist.js` 路由和 `userlist.ejs` 视图文件

如下图所示：

![](http://oswrtif8l.bkt.clouddn.com/WechatIMG150.jpeg)

- `userlist.js`内容如下：

```js
var express = require('express');
var router = express.Router();

/**
 * 这几行会告诉app我们需要连接MongoDB，我们用Monk来负责这个连接，我们数据库位置是localhost:27017/nodetest1。注意27017是mongodb的默认端口，如果因为某些原因你修改了端口，记录这里也要跟着改。
 */
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('127.0.0.1:27017/nodetest1');

/* GET userlist page. */
router.get('/', function (req, res, next) {
    var collection = db.get('usercollection');
    collection.find({}, {}, function (e, docs) {
        res.render('userlist', {"userlist": docs});
    });
});

module.exports = router;
```

- `userlist.ejs`内容如下：

```js
<!DOCTYPE html>
<html>

<head>
    <title>USERLIST</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
</head>

<body>
    <h1>Userlist</h1>
    <ul>

<%
for(var i in userlist){
%>
            <li>
                <a href="mailto:<%=userlist[i].email%>">
                    <%=userlist[i].username%>
                </a>
            </li>
            <% } %>
    </ul>
</body>

</html>
```

保存文件，重启node服务器。希望你还记得怎么重启。打开浏览器，访问`http://localhost:3000/userlist`，你应该能看到这样的界面：

![](http://oswrtif8l.bkt.clouddn.com/WechatIMG151.jpeg)

现在你从数据库里取到了数据并且显示到了网页上。太棒了。

## 第4部分 – 终于到了：往数据库里写入数据


往数据库里写入数据也不是很困难。我们需要一个route来接收POST请求而不是GET。我们可以使用Ajax，这是我最常用的方式。不过那可能需要另外一篇教程了，所以这里我们还是用最原始的post手段。当然，要记住，如果你愿意，用ajax并不难。

- 第1步 – 建立你的数据输入页面

这里我们需要快一点：建立两个丑陋的不加样式的文本框和一个提交按钮。像上面一样，我们从`app.use()`开始。打开`app.js`找到下面的代码：

```js
var index = require('./routes/index');
var users = require('./routes/users');
var helloworld = require('./routes/helloworld');
var userlist = require('./routes/userlist');
```

在下面加上：

```js
var newuser = require('./routes/newuser');
```

再找到下面的代码：

```js
app.use('/', index);
app.use('/users', users);
app.use('/helloworld', helloworld);
app.use('/userlist', userlist);
```

在下面加上：

```js
app.use('/newuser', newuser);
```

在`routs`文件夹中创建`newuser.js`文件，内容如下：

```js
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('newuser', { title: 'Add New User' });
});

module.exports = router;
```

在`views`文件夹中创建`newuser.ejs`文件，内容如下：

```html
<!DOCTYPE html>
<html>

<head>
    <title>Add User</title>
    <link rel="stylesheet" href="/stylesheets/style.css" />
</head>

<body>
    <h1>
        <%= title %>
    </h1>
    <form name="adduser" method="post" action="/adduser">
        <input type="text" placeholder="username" name="username" />
        <input type="text" placeholder="useremail" name="useremail" />
        <input type="submit" value="submit" />
    </form>
</body>

</html>
```

这里我们创建一个form，method是post，action是adducer。简单明了。下面我们定义了两个输入框和一个提交按钮。启动服务器，浏览器打开`http://localhost:3000/newuser`效果图如下：

![](http://om1c35wrq.bkt.clouddn.com/WechatIMG152.jpeg)

点提交按钮，会出现如下错误，我们来修正错误。

```text
Not Found

404

Error: Not Found
    at /Users/liyuechun/Desktop/60MINUTES/nodetest1/app.js:36:13
    at Layer.handle [as handle_request] (/Users/liyuechun/Desktop/60MINUTES/nodetest1/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/Users/liyuechun/Desktop/60MINUTES/nodetest1/node_modules/express/lib/router/index.js:317:13)
    at /Users/liyuechun/Desktop/60MINUTES/nodetest1/node_modules/express/lib/router/index.js:284:7
    at Function.process_params (/Users/liyuechun/Desktop/60MINUTES/nodetest1/node_modules/express/lib/router/index.js:335:12)
    at next (/Users/liyuechun/Desktop/60MINUTES/nodetest1/node_modules/express/lib/router/index.js:275:10)
    at /Users/liyuechun/Desktop/60MINUTES/nodetest1/node_modules/express/lib/router/index.js:635:15
    at next (/Users/liyuechun/Desktop/60MINUTES/nodetest1/node_modules/express/lib/router/index.js:260:14)
    at Function.handle (/Users/liyuechun/Desktop/60MINUTES/nodetest1/node_modules/express/lib/router/index.js:174:3)
    at router (/Users/liyuechun/Desktop/60MINUTES/nodetest1/node_modules/express/lib/router/index.js:47:12)
```

- 第2步 – 创建你的数据库处理函数

打开`app.js`文件，找到下面的代码：

```js
var index = require('./routes/index');
var users = require('./routes/users');
var helloworld = require('./routes/helloworld');
var userlist = require('./routes/userlist');
var newuser = require('./routes/newuser');
```

在下面添加一行：

```js
var adduser = require('./routes/adduser');
```

再次找到下面的代码：

```js
app.use('/', index);
app.use('/users', users);
app.use('/helloworld', helloworld);
app.use('/userlist', userlist);
app.use('/newuser', newuser);
```

在下面添加一行：

```js
app.use('/adduser', adduser);
```

接下来在`routes`文件夹下面创建`adduser.js`文件，内容如下：

```js
var express = require('express');
var router = express.Router();
// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');

/* POST userlist page. */
router.post('/', function (req, res, next) {
    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username": userName,
        "email": userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });

});

module.exports = router;
```

上面的代码是通过post请求拿到表单中的`username`和`email`，然后重定向到`userlist`页面。

启动服务器，在浏览器中打开`http://localhost:3000/newuser`，效果如下所示：

![](http://om1c35wrq.bkt.clouddn.com/newuser.png)

在里面输入用户名和邮箱，就会跳转到`userlist`页面，如下面所示：

![](http://om1c35wrq.bkt.clouddn.com/userlist.png)


现在我们正式的完成了使用Node.js，Exress，Ejs读取和写入Mongodb数据库，我们已经是牛X的程序员了。

恭喜你，真的。如果你认真的看完了这篇教程，并且很认真的学习而不只是复制代码，你应该对routes, views，读数据，写入数据有了完整的概念。这是你用来开发任何其它完整的Web网站所需要的一切知识点！不管你怎么想，我觉得这真挺酷的。

|扫码申请加入全栈部落|
|:---------------:|
|![](http://upload-images.jianshu.io/upload_images/75699-a5d38be84e4eac70.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)|






