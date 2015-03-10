Session.setDefault("currentUrl",{index:"active",login:"",reg:""});

Session.setDefault("info",{success:"",error:""});

Template.info.info =function(){
    return Session.get("info");
}

Template.container.currentUrl=function(){
    return Session.get("currentUrl");
}
Template.nav.active=function (){
    return Session.get("currentUrl");
}

Template.reg.events({
    'click #submit_button':function(evt) {
            evt.preventDefault();
            Accounts.createUser({username: $("#username").val(),password:$("#password").val()},function (err){
                if(err){
                    Session.set("info", {success: "", error: err.reason});
                }else{
                    Session.set("info",{success:"注册成功" , error:""})
                }
        });
    }
});


var urlRouter = Backbone.Router.extend({
    routes:{
        "" : "index",
        "login":"login",
        "reg" : "reg"
    },

    index:function(){
        Session.set("currentUrl",{index:"active", login:"",reg:""});
    },

    login:function(){
        Session.set("currentUrl",{index:"",login:"active",reg:""});
    },


    reg:function(){
        Session.set("currentUrl",{index:"", login:"",reg:"active"});
    },

    redirect:function(url){
        this.navigate(url, true);
    }
});
Router = new urlRouter;
Meteor.startup(function (){
    Backbone.history.start({pushState: true});
});
