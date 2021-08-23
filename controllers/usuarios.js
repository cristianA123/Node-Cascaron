const { response, request } = require( 'express' );

const bcryptjs = require('bcryptjs');



const Usuario =  require('../models/usuario');


const usuariosGet = async (req = request, res= response) => {


    // const {q, nombre = "no ingreso nombre", apikey} = req.query;

    const { limit =5, desde = 0 } = req.query;
    /*  const usuario = await Usuario.find( { estado : true } )
        .skip( Number( desde ) )  // podemos validar desde donde, por cualquier error
        .limit( Number(  limit));
    const total = await Usuario.countDocuments( { estado : true } ); */


//Esto es una consulta mas rapida

    const [total, usuario] = await Promise.all([
        Usuario.countDocuments( { estado : true }),
        Usuario.find( { estado : true })
            .skip( Number( desde ) )  // podemos validar desde donde, por cualquier error
            .limit( Number(  limit))
    ])

    res.json({
        usuario,
        total
    }
        
    );
};

const usuariosPut = async (req = request, res =response ) => {

    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO VALIDAR EN LA BD
    if( password ){
        // Emcriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, { new: true })

    res.json({
        usuario
    });
}

const usuariosPost = async (req, res =response) => {

  

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    // Emcriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt )

    //Guardar en BD
    await usuario.save();

    res.json({
        'ok':true,
        msg: 'POST API',
        usuario
    });
}
const usuariosPath   =(req, res) => {
    res.json({
        'ok':true,
        msg: 'PATCH API'
    })
}
const usuariosDelete = async (req, res) => {

    const { id } = req.params;

    // Fisicamente lo barram,ps
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado :false } , { new : true } )


    res.json({
        'ok':true,
        msg: 'DELETE API',
        id,
        usuario
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPath,
    usuariosDelete
}


// git tag -a v0.0.2 -m "modulo 9 terminado"
// $ git push --tags