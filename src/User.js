//Esta clase no sirve 
class User{ 

    constructor(token){
        if(this.token=null){
            this.token=token;
            return this.token;
        }else{
            return this.token;
        }
    }

    getToken(){
        return this.token;
    }

}