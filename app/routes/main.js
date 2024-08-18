const express = require('express')
const router = express.Router()
const { MercadoPagoConfig, Preference } = require('mercadopago')
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN })
const preference = new Preference(client);

router.get('/', function (req, res) {
    res.render('pages/index')
})

router.post('/adicionar-carrinho', async function (req, res) {

    const { name, price } = req.query

    // verifica se preço é numero
    if (isNaN(price)) {
        return res.redirect('/')
    }

    try {
        const response = await preference.create({
            body: {
                items: [
                    {
                        id: "teste123", // UUID
                        title: name,
                        picture_url: 'https://fretus.onrender.com/imgs/logotca.png',
                        quantity: 1,
                        currency_id: 'BRL',
                        unit_price: Number(price),
                    }
                ],
                back_urls: {
                    "success": `${process.env.SITE_URL}/feedback`,
                    "failure": `${process.env.SITE_URL}/feedback`,
                    "pending": `${process.env.SITE_URL}/feedback`
                },
                auto_return: "approved",
                external_reference: "teste123",
                payment_methods: {
                    excluded_payment_methods: [
                        { id: "bolbradesco" },
                        { id: "pec" }
                    ],
                    excluded_payment_types: [
                        { id: "debit_card" }
                    ],
                    installments: 1
                }
            },
        })

        console.log(response.id)
        res.redirect(`/comprar?name=${name}&price=${price}&id=${response.id}`)
    } catch (error) {
        console.log(error)
        res.json({ error })
    }

})

router.get('/comprar', function (req, res) {
    const { name, price, id } = req.query

    res.render('pages/comprar', { name, price, id })
})

router.get('/feedback', function (req, res) {
    res.json({ data: req.query })
})

router.get('/search-preference', async function (req, res) {
    try {
        const id = "1952586456-2d6fbf42-6fa3-4de0-be0d-9244e066fe58"
        const response = await preference.get({ preferenceId: id })

        res.json(response)
    } catch (error) {
        console.log(error)
        res.json({ error })
    }
})

module.exports = router