const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');

const app = express();
app.use(express.json())
app.use(cors());

const conn = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "signup"

    }
) 
app.post('/login', async (req,res) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        const [row] = await conn.execute(
            "SELECT * FROM `users` WHERE `email`=?",
            [req.body.email]
          );

        if (row.length === 0) {
            return res.status(422).json({
                message: "Invalid email address",
            });
        }

        const passMatch = await bcrypt.compare(req.body.password, row[0].password);
        if(!passMatch){
            return res.status(422).json({
                message: "Incorrect password",
            });
        }

        const theToken = jwt.sign({id:row[0].id},'the-super-strong-secrect',{ expiresIn: '1h' });

        return res.status(200).json({
            message: "Login Successfully",
            token:theToken
        });

    }
    catch(err){
        next(err);
    }
});


app.post('/signup', async (req,res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        const [row] = await conn.execute(
            "SELECT `email` FROM `users` WHERE `email`=?",
            [req.body.email]
          );

        if (row.length > 0) {
            return res.status(201).json({
                message: "The E-mail already in use",
            });
        }

        const hashPass = await bcrypt.hash(req.body.password, 12);

        const [rows] = await conn.execute('INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)',[
            req.body.name,
            req.body.email,
            hashPass
        ]);

        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "The user has been successfully inserted.",
            });
        }
        
    }catch(err){
        next(err);
    }
});

app.post('/task', async (req,res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        const [row] = await conn.execute(
            "SELECT * FROM `task` WHERE `taskName`=?",
            [req.body.taskName]
          );

        if (row.length > 0) {
            return res.status(201).json({
                message: "The task already in use",
            });
        }

        const [rows] = await conn.execute('INSERT INTO `task`(`taskName`,`userId`) VALUES(?,?)',[
            req.body.taskName,
            req.body.userId
        ]);

        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "The task has been successfully created.",
            });
        }

    } catch(err) {
        next(err);
    }
});

app.get('/task/:taskId', async (req,res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        const [row] = await conn.execute(
            "SELECT * FROM `task` WHERE `id`=?",
            [req.body.taskId]
          );

        if (row.length > 0) {
            return res.status(201).json({
                message: "The task is not in database",
            });
        }

        if (rows.affectedRows === 1) {
            return res.status(201).json({
                data: res.data
            });
        }

    } catch(err) {
        next(err);
    }
});

app.put('/task/:taskId', async (req,res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        const [row] = await conn.execute(
            "update task SET taskName =?, WHERE id = ?"
            [req.body.taskId]
          );

        if (rows.affectedRows === 1) {
            return res.status(201).json({
                data: res.data
            });
        }

    } catch(err) {
        next(err);
    }
});

app.delete('/task/:taskId', async (req,res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        const [row] = await conn.execute(
            "delete FROM task WHERE id = ?"
            [req.body.taskId]
          );

        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: 'task delete successfully'
            });
        }

    } catch(err) {
        next(err);
    }
});

app.listen(8081,()=>{
    console.log("listening");
})