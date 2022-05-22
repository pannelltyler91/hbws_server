require("dotenv").config();
//hello
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001;
const db = require("./models");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//add async back in before req, res
app.post("/create_checkout_session", async (req, res) => {
    try{
  const session = await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    mode:'payment',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'usd',
          },
          display_name: 'Free shipping',
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 5,
            },
            maximum: {
              unit: 'business_day',
              value: 7,
            },
          }
        }
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 1500,
            currency: 'usd',
          },
          display_name: 'Next day air',
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 1,
            },
            maximum: {
              unit: 'business_day',
              value: 1,
            },
          }
        }
      },
    ],
    line_items:req.body.cart.map((item) => {

      return{
        price_data:{
          currency:'usd',
          product_data:{
            name:item.name
          },
          unit_amount:item.price * 100
        },
        quantity:item.quantity
      }
    }),
    success_url:`${process.env.SERVER_URL}/success`,
    cancel_url:`${process.env.SERVER_URL}/cancel`
  })
res.json({ url: session.url });
  

}catch(e){
  res.status(500).json({error:e.message})
}
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
