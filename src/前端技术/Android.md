---
title: Android
date: 2023-03-07
icon: android
category:
- 前端技术
tag:
- android
- 客户端
---



## Android Studio配置

### Gradle配置

由于Gradle服务器远在国外，下载速度较慢，国内下载可以使用阿里云提供的镜像源。

如果你的Gradle版本在7.0以上，可以作如下配置：

```gradle
//settings.gradle
pluginManagement {
    repositories {
        maven{ url 'https://maven.aliyun.com/repository/gradle-plugin'}
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
        repositories {
            //对应google()
            maven {url 'https://maven.aliyun.com/repository/google'}
            //对应jcenter()
            maven {url 'https://maven.aliyun.com/repository/jcenter'}
            //公共库
            maven {url 'https://maven.aliyun.com/repository/public'}
            maven {url 'https://maven.aliyun.com/repository/central'}
            mavenCentral()
        }
}
```

如果你的Gradle版本在7.0以下，可做如下配置：

```gradle
//build.gradle(app)
allprojects {
    repositories {
        maven {url 'https://maven.aliyun.com/repository/google'}
        maven {url 'https://maven.aliyun.com/repository/jcenter'}
        maven {url 'https://maven.aliyun.com/repository/public'}
    }
}
```

由于阿里云Maven仓库中1.8.0版本的Kotlin缺少部分依赖，所以我这里使用的是1.7.0版本的Kotlin，注意要将末尾带+号的那一行删去。

```gradle
//build.gradle(app)
android {
    namespace 'com.example.androidtutorial'
    compileSdk 33
+    compileSdkPreview "UpsideDownCake"  //如果此时报错与SDK有关，就加上这行代码
    defaultConfig {
        applicationId "com.example.androidtutorial"
        minSdk 30
        targetSdk 33
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
dependencies {
    implementation 'androidx.core:core-ktx:1.7.0'
    implementation 'androidx.appcompat:appcompat:1.4.1'
    implementation 'com.google.android.material:material:1.5.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.3'
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.3'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.4.0'
}
```

### 最佳实践1

![最佳实践](https://etheral.oss-cn-shanghai.aliyuncs.com/images/QQ%E5%9B%BE%E7%89%8720230320222109.png)
