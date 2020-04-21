const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


// ========================
// Mostrar todas las categorias
// ========================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments({}, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    conteoTotal: conteo,
                    categorias
                })
            })

        })

});


// ========================
// Mostrar una categoria por ID
// ========================
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            categoria
        })

    });


});


// ========================
// Crear nueva categoria
// ========================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


// ========================
// Actualizar descripcion de categoria
// ========================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Categoria.findByIdAndUpdate(id, { descripcion: req.body.descripcion }, {
            new: true,
            runValidators: true
        },
        (err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoría no encontrada'
                    }
                });
            }
            res.json({
                ok: true,
                categoria: categoriaDB
            })
        })
});


// ========================
// Borrar categoria
// ========================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoría borrada',
            categoria: categoriaBorrada
        })
    });

});


module.exports = app;