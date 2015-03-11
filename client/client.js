
Session.setDefault("currentUrl", {index: "active", login: "", reg: ""});

Session.setDefault("info", {success: "", error: ""});

Template.info.info = function () {
    return Session.get("info");
}

Template.container.currentUrl = function () {
    return Session.get("currentUrl");
}
Template.nav.active = function () {
    return Session.get("currentUrl");
}

Template.reg.events({
    'click #submit_button': function (evt) {

        var $username = $("#username").val();
        var $password = $("#password").val();
        var $repeat = $("#password-repeat").val();
        if ($password.length == 0 || $username.length == 0) {
            Session.set("info", {success: "", error: "用户名或者密码不能为空"});
            return;
        }
        if ($password != $repeat) {
            Session.set("info", {success: "", error: "两次输入密码不一致"});
            return;
        }

        evt.preventDefault();
        Accounts.createUser({username: $("#username").val(), password: $("#password").val()}, function (err) {
            if (err) {
                Session.set("info", {success: "", error: err.reason});
            } else {
                Router.redirect("/");
                Session.set("info", {success: "注册成功", error: ""})
            }
        });
    }
});

/**
 * event 采用集合方式进行传递事件
 */
Template.login.events({
    'click #login_submit':function(event){
        event.preventDefault();
        var $username = $("#username").val();
        var $password = $("#password").val();
        if($username.length ==0 || $password.length==0){
            Session.set("info",{success:"",error:"用户名或密码不能为空"});
        }

        // 登录使用公共方法登录
        Meteor.loginWithPassword($username,$password ,function (error){
            if(error){
                Session.set("info",{success:"",error:error.reason()});
            }else{
                Router.redirect("/");
                Session.set("info",{success:"登录成功",error:""});
            }
        });
    }
});

var urlRouter = Backbone.Router.extend({
    routes: {
        "": "index",
        "login": "login",
        "reg": "reg",
        "logout":"logout"
    },

    index: function () {
        Session.set("currentUrl", {index: "active", login: "", reg: ""});
    },

    login: function () {
        if(Meteor.userId()){
            this.navigate("/",true);
            Session.set("info",{success:"用户已经在线",err:""});
            return ;
        }
        Session.set("currentUrl", {index: "", login: "active", reg: ""});
    },


    reg: function () {
        Session.set("currentUrl", {index: "", login: "", reg: "active"});
    },

    logout : function (){
        if(Meteor.userId()){
            Meteor.logout();
            Session.set("info",{success:"登出成功",error:""});
            return ;
        }else{
            this.navigate("/",true);
            Session.set("info",{success:"用户不在线",error:""});
        }
    },

    redirect: function (url) {
        this.navigate(url, true);
    }
});
Router = new urlRouter;
Meteor.startup(function () {
    Backbone.history.start({pushState: true});
});
