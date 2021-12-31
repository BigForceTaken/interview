## 虚拟机

#### 特点

1. 资源占用多 
2. 冗余步骤多 
3. 启动慢 

## Linux容器 

由于虚拟机存在这些缺点，Linux 发展出了另一种虚拟化技术：Linux 容器（Linux Containers，缩写为 LXC）

**Linux 容器不是模拟一个完整的操作系统，而是对进程进行隔离。**

#### 特点 

1. 启动快 
2. 资源占用少 
3. 体积小 

## Docker 

**Docker 属于 Linux 容器的一种封装，提供简单易用的容器使用接口。**它是目前最流行的 Linux 容器解决方案。

Docker 将应用程序与该程序的依赖，打包在一个文件里面。运行这个文件，就会生成一个虚拟容器。程序在这个虚拟容器里运行，就好像在真实的物理机上运行一样。有了 Docker，就不用担心环境问题。

总体来说，Docker 的接口相当简单，用户可以方便地创建和使用容器，把自己的应用放入容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。

### 安装

Docker 是一个开源的商业产品，有两个版本：社区版（Community Edition，缩写为 CE）和企业版（Enterprise Edition，缩写为 EE）。个人一般使用CE。

Docker 是服务器----客户端架构。命令行运行`docker`命令的时候，需要本机有 Docker 服务。

### image文件

**Docker 把应用程序及其依赖，打包在 image 文件里面。**只有通过这个文件，才能生成 Docker 容器。image 文件可以看作是容器的模板。Docker 根据 image 文件生成容器的实例。同一个 image 文件，可以生成多个同时运行的容器实例。

image 是二进制文件。实际开发中，一个 image 文件往往通过继承另一个 image 文件，加上一些个性化设置而生成。举例来说，你可以在 Ubuntu 的 image 基础上，往里面加入 Apache 服务器，形成你的 image。

```

# 列出本机的所有 image 文件。
$ docker image ls
# 删除 image 文件
$ docker image rm [imageName]
# 抓取image 文件 
docker image pull library/hello-world
# docker image pull是抓取 image 文件的命令。library/hello-world是 image 文件在仓库里面的位置，其中library是 image 文件所在的组，hello-world是 image 文件的名字。由于 Docker 官方提供的 image 文件，都放在library组里面，所以它的是默认组，可以省略。
docker image pull hello-world 
# 抓取成功以后，就可以在本机看到这个 image 文件了
docker image ls
# 现在 运行这个image文件
docker container run hello-world
# docker container run命令会从 image 文件，生成一个正在运行的容器实例。
# 注意，docker container run命令具有自动抓取 image 文件的功能。如果发现本地没有指定的 image 文件，就会从仓库自动抓取。因此，前面的docker image pull命令并不是必需的步骤。
#对于那些不会自动终止的容器，必须使用docker container kill 命令手动终止。
 docker container kill [containID]
```

image 文件是通用的，一台机器的 image 文件拷贝到另一台机器，照样可以使用。一般来说，为了节省时间，我们应该尽量使用别人制作好的 image 文件，而不是自己制作。即使要定制，也应该基于别人的 image 文件进行加工，而不是从零开始制作。

为了方便共享，image 文件制作完成后，可以上传到网上的仓库。Docker 的官方仓库 [Docker Hub](https://hub.docker.com/) 是最重要、最常用的 image 仓库。此外，出售自己制作的 image 文件也是可以的。

### 容器文件

**image 文件生成的容器实例，本身也是一个文件，称为容器文件。**也就是说，一旦容器生成，就会同时存在两个文件： image 文件和容器文件。而且关闭容器并不会删除容器文件，只是容器停止运行而已。

```
# 列出本机正在运行的容器
$ docker container ls

# 列出本机所有容器，包括终止运行的容器
$ docker container ls --all
```

终止运行的容器文件，依然会占据硬盘空间，可以使用[`docker container rm`](https://docs.docker.com/engine/reference/commandline/container_rm/)命令删除。

```
 docker container rm [containerID]
```

### Dockerfile 文件 

学会使用 image 文件以后，接下来的问题就是，如何可以生成 image 文件？

这就需要用到 Dockerfile 文件。它是一个文本文件，用来配置 image。Docker 根据 该文件生成二进制的 image 文件。

### 制作image文件

1. 创建Dockerfile文件，如果有排除打包的文件的话，还要新建.dockerignore

   ```
   # 该image文件继承官方的node image 冒号表示标签，即版本
   FROM node:8.4 
   # 将当前目录下的所有文件(除.dockerignore排除的)都拷贝进入image文件的/app目录
   COPY . /app
   # 指定接下来的工作路径为/app
   WORKDIR /app
   # 在/app目录下运行npm install 安装后的依赖都要打包进image文件
   RUN npm install --registry=https://registry.npm.taobao.org
   # 将容器的3000端口暴露出来，允许外部连接
   EXPOSE 3000
   CMD npm run serve #在容器启动以后，自动执行的命令，只能有一个CMD命令 RUN 命令可以有多个
   ```

   

2. 有了Dockerfile文件，就相当于知道怎么创建image文件了，第二步就可以生成image文件了

   ```
   docker image build -t imagename .
   // -t 参数用来指定image文件的名字，后面那个点指定了Dockerfile文件的路径
   ```

3. 有了image文件后，就可以生成容器了。

   ```
   docker container run -p 8000:8080 -it vue-demo-image  --volume "$PWD/html":/usr/share/nginx/html  /bin/bash 
   ```

   - -p 参数：把容器的8080端口映射到本机的8000端口
   - -it 参数：容器的Shell映射到当前的Shell ,
   - vue-demo-image: image文件的名字
   - /bin/bash： 容器启动以后，内部的第一个执行的命令，这里为了启动Bash，这样就可以使用Shell，这样之前的-it参数才好用
   - --volume 目录映射，把当前目录的html文件夹映射到容器中/usr/share/nginx/html

   在容器的命令行，按下Ctrl+c停止Node进程，然后按Ctrl+d退出容器。也可以用docker container kill 来终止容器运行。

   ### 常用命令

   ```
   docker container ls //查出正在运行的容器
   docker container ls --all //查出本机所有的容器文件
   docker container rm [containerID] // 删除指定的容器文件
   docker container run -d --rm -p 8000:3000 -it vue-demo-image /bin/bash // 运行容器，--rm 表示在容器终止运行后自动删除容器文件 -d 在后台运行
   
   $ docker container run -d --name wordpressdb 
     --env MYSQL_ROOT_PASSWORD=123456 
     --env MYSQL_DATABASE=wordpress 
     mysql:5.7
    // --env 表示向容器里面传入环境变量
   docker image build -t vue-demo-image // 生成image文件
   docker container start [containerID] // docker container run 命令是新建容器，每次都会重新生成容器文件，而这个命令对于重复的命令，可以重复利用容器文件
   docker container stop [containerID] // 区别于docker container kill 该命令执行后不会马上终止容器运行，而是告诉容器一个指令，等收尾工作完成后才会终止容器
   docker container logs // 查看docker容器的输出，如果docker run 命令运行的时候，没有使用-it参数，这个命令就能查看输出
   docker container exec -it [containerID] // 用于进入一个正在运行的 docker 容器。如果docker run命令运行容器的时候，没有使用-it参数，就要用这个命令进入容器。一旦进入了容器，就可以在容器的 Shell 执行命令了。
   docker container cp [containID]:[/path/to/file] . //用于从正在运行的 Docker 容器里面，将文件拷贝到本机。下面是拷贝到当前目录的写法。
   docker inspect [containerID | contianerName] // 获取容器的元数据
   ```

   `RUN`命令与`CMD`命令的区别在哪里？简单说，`RUN`命令在 image 文件的构建阶段执行，执行结果都会打包进入 image 文件；`CMD`命令则是在容器启动后执行。另外，一个 Dockerfile 可以包含多个`RUN`命令，但是只能有一个`CMD`命令。**注意**，指定了`CMD`命令以后，`docker container run`命令就不能附加命令了（比如前面的`/bin/bash`），否则它会覆盖`CMD`命令。现在，启动容器可以使用下面的命令。

   ```
   docker container run --rm -p 8000:3000 -it vue-demo-image
   ```

   ### 发布image

    ``` 
   // 首先，登录
   docker login 
   // 然后为本地的image标注用户名和版本
   docker image tag [imageName] [username]/[repository]:[tag]
   如：docker image tag vue-demo-image cdzzl/demo:0.0.1
   // 也可以不标注用户名，重新构建一下image文件
   docker image build -t cdzzl/demo:0.0.1
   //最后 发布image
   docker image push cdzzl/demo:0.0.1
    ```

   ### Docker Compose

    Docker 公司推出的一个工具软件，可以管理多个 Docker 容器组成一个应用。你需要定义一个 [YAML](https://www.ruanyifeng.com/blog/2016/07/yaml.html) 格式的配置文件`docker-compose.yml`，写好多个容器之间的调用关系。然后，只要一个命令，就能同时启动/关闭这些容器。

   ```
   # 查看安装版本
   $ docker-compose --version
   # 启动所有服务
   $ docker-compose up
   # 关闭所有服务,关闭以后，容器文件还是存在，写在里面的数据不会丢失，下次启动还可以复用。
   $ docker-compose stop
   # 删除容器文件
   $ docker-compose rm
   ```

   

> 参考：http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html

