const db = {
    Usuarios: require("../models/Usuarios"),
    Administrador : require("../models/Administrador"),
    Docentes: require("../models/Docente")
}

const getUser = async function (req,res){
    /*const usuario = await db.Usuarios.findOne({
        where:{
            username: req.params.username,
            password: req.params.password
        }            
    }).then(async function (user){
        if(user.tipo == "DOCENTE"){
            const user2 = await db.Docentes.findOne({
                where:{usuarioId: user.id}
            }).then(function(user2){
                return {
                    usuario : user.username,
                    password : user.password,
                    tipo : user.tipo,
                    id : user2.id,
                    apellido: user2.apellido,
                    nombre: user2.nombre,
                    legajo: user2.legajo
                };
            }, function(reason) {
                console.log("no encontro ningun docente");
                return {};
            });
        }else{
            const user2 = await db.Administrador.findOne({
                where:{usuarioId: user.id}
            }).then(function(user2){
                return {
                    usuario : user.username,
                    password : user.password,
                    tipo : user.tipo,
                    id : user2.id,
                    apellido: user2.apellido,
                    nombre: user2.nombre,
                    legajo: user2.legajo
                };
            },function(reason) {
                console.log("no encontro ningun admin");
                return {};
            });
        }
    });*/

    const usuario = await db.Usuarios.findOne({
        where:{
            username: req.params.username,
            password: req.params.password
        }            
    });

    if(usuario==null){
        return {};
    }else{
        var docOAdm;
        if(usuario.tipo == "DOCENTE"){
            docOAdm = await db.Docentes.findOne({
                where:{usuarioId: usuario.id}
            })
        }else{
            docOAdm = await db.Administrador.findOne({
                where:{usuarioId: usuario.id}
            })
        }
        return {
            usuario : usuario.username,
            password : usuario.password,
            tipo : usuario.tipo,
            id : docOAdm.id,
            apellido: docOAdm.apellido,
            nombre: docOAdm.nombre,
            legajo: docOAdm.legajo
        }
    }
    
    

}

module.exports.getUser = getUser;