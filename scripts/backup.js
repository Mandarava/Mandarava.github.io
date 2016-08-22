require('shelljs/global');

try {
    hexo.on('deployAfter', function() { //当deploy完成后执行备份
        run();
    });
} catch (e) {
    console.log("产生了一个错误<(￣3￣)> !，错误详情为：" + e.toString());
}

function run() {
    if (!which('git')) {
        echo('Sorry, this script requires git');
        exit(1);
    } else {
        hexo_iamlj_backup();
        //hexo_next_iamlj_backup();
    }
}

function hexo_iamlj_backup() {
    echo("======================hexo_backup Auto Backup Begin===========================");
    cd('F:/Users/zt/blog/blog'); //此处修改为Hexo根目录路径
    if (exec('git add --all').code !== 0) {
        echo('Error: Git add failed');
        exit(1);
    }
    if (exec('git commit -am "source backup"').code !== 0) {
        echo('Error: Git commit failed');
        exit(1);
    }
    if (exec('git push origin backup').code !== 0) {
        echo('Error: Git push failed');
        exit(1);
    }
    echo("==================hexo_backup Auto Backup Complete============================");
}