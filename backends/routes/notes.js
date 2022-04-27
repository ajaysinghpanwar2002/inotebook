//importng express
const express = require('express');
//importing router
const router = express.Router();
//importing fetchuser
var fetchuser = require('../middleware/fetchuser');
//importing notes wala model
const Note = require('../models/Note');
//importing express validator 
const { body, validationResult } = require('express-validator');
//here we simply making get request to the thunderclient 



// Route 1: get all the notes using : GET "/api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error ");
    }
})



// Route 2: add a new note using : POST "/api/notes/addnote" Login reqd
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //agar errors aaye to hum essey pass krdenge 
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error ");
    }
})



// Route 3: update a note: Put "/api/notes/updatenote" Login reqd
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    //create a newNote object
    try {
        const newNote = {};
        //in 3 no line ka matlab agar naya title , dec, tag aaraha h to update kr warna rhne do 
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };
        //fine the note to be updated and update it 
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        //abhe check krenge ke iska user yahi h ke nhe 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        // iss code se agar koi nayaa  note aayega to wo update ho jayega 
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error ");
    }
})



// Route 4: delete a note: delete "/api/notes/deletenote" Login reqd
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //fine the note to be delete and deleted it 
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        //abhe check krenge ke iska user yahi h ke nhe then we'll allow the deletion 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        // agar note ko delete kiya to us bande ke notes delete ho jayege 
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted ", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error ");
    }
})

//we have to export also
module.exports = router;

