const express = require('express');
const _ = require('underscore');

let { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

// ======================
// Obtener productos
// ======================
app.get('/productos', verificaToken, (req, res) => {
    //traer todos los productos
    //populate: usuario y categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments({}, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    conteoTotal: conteo,
                    productos
                })
            })

        })



});


// ======================
// Obtener productos por ID
// ======================
app.get('/producto/:id', verificaToken, (req, res) => {
    //populate: usuario y categoria
    //paginado
    let id = req.params.id;
    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                })
            }

            res.json({
                ok: true,
                producto
            })

        });


});

// ======================
// Buscar productos
// ======================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    //populate: usuario y categoria

    let termino = req.params.termino;
    let regexp = new RegExp(termino, 'i');

    Producto.find({ nombre: regexp })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                })
            }

            res.json({
                ok: true,
                producto
            })

        });


});

// ======================
// Crear un nuevo producto
// ======================
app.post('/producto', verificaToken, (req, res) => {
    //grabar el usuario y la categoria
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
});


// ======================
// Actualizar producto por ID
// ======================
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);

    Producto.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
        },
        (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            })
        })
});


// ======================
// Borrar un producto por ID
// ======================
app.delete('/producto/:id', verificaToken, (req, res) => {
    //disponible a false

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, {
            new: true,
            runValidators: true
        },
        (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                message: 'Producto eliminado del inventario',
                producto: productoDB
            })
        })
});



module.exports = app;