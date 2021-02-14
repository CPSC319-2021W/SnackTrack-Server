import { Snacks } from './model.js';

const BAD_REQUEST = "400";
const NOT_AUTHORIZED = "401";
const NOT_FOUND = "404";

export const addSnack = async(req, res) => {
    try {
        const snack = req.body;
        snack.last_update_dtm = new Date().toISOString();
        const result = await Snacks.create(snack);

        return res.status(201).send(result);

    } catch (err) {
        if (err.message === BAD_REQUEST) {
            return res.status(400).send({ Error: "Bad Request" });
        } else if (err.message === NOT_AUTHORIZED) {
            return res.status(401).send({ Error: "Not Authorized" });
        } else {
            return res.status(409).send({ Error: "Conflict" })
        }
    }
}

export const getSnacks = async(req, res) => {
    try {
        const snacks =  await Snacks.findAll();
        const response = JSON.stringify(snacks);
        return res.status(200).send(response);
    } catch (err) {
        if (err.message === NOT_FOUND) {
            return res.status(404).send({ Error: "Not Found" });
        } else {
            return res.status(400).send({ Error: err.message });
        }
    }
}
