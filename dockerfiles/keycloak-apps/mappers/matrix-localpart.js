String.prototype.customConvertion=function(){
    return this.replace(/@/,'-');
}

exports = user.getUsername().customConvertion()
