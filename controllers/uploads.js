const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require("../helpers");
const { User, Product } = require("../models");



const cargarArchivo = async (req, res) => {

    try {
        // Imagenes
        const name = await subirArchivo(req.files, undefined, 'imgs')

        res.json({
            name
        })

    } catch (msg) {

        res.status(400).json({ msg })
    }



}

const actualizarImagen = async (req, res) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un user con id:${id}` });
            }
            break;

        case 'products':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un product con id:${id}` });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });

    }

    /// Limpiar imagenes previas
    if (modelo.img) {

        //Hay que borra la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const name = await subirArchivo(req.files, undefined, coleccion);

    modelo.img = name;

    await modelo.save();

    res.json(modelo);

}

const mostrarImagen = async (req, res) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un user con id:${id}` });
            }
            break;

        case 'products':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un product con id:${id}` });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });

    }

    if (modelo.img) {
        //Hay que borra la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) {

            return res.sendFile(pathImagen)
        }

    }

    res.sendFile(path.join(__dirname, '../assets', 'no-image.jpg'));

}


const actualizarImagenCloudinary = async (req, res) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un user con id:${id}` });
            }
            break;

        case 'products':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un product con id:${id}` });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });

    }

    /// Limpiar imagenes previas
    if (modelo.img) {

        const nombreArr = modelo.img.split("/");
        const nombre = nombreArr[ nombreArr.length - 1 ];

        const [ public_id ] = nombre.split('.');

        console.log( public_id )

        cloudinary.uploader.destroy( public_id )

        //Hay que borra la imagen del servidor
        // const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }
    }

    const { tempFilePath } = req.files.archivo;
    const {  secure_url } = await cloudinary.uploader.upload( tempFilePath )

    // const name = await subirArchivo(req.files, undefined, coleccion);

    modelo.img = secure_url;

    await modelo.save();

    res.json( modelo );

}




module.exports = {
    cargarArchivo,
    actualizarImagenCloudinary,
    mostrarImagen
}