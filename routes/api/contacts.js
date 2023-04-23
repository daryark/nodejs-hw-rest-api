const express = require("express");
const { NotFound, BadRequest, Conflict } = require("http-errors");
const { contactSchema } = require("../../schemas/schema");

const router = express.Router();
const contactsOperations = require("../../models/contacts");

router.get("/", async (req, res, next) => {
	try {
		const result = await contactsOperations.listContacts();
		res.json(result);
	} catch (error) {
		next(error);
	}
});

router.get("/:id", async (req, res, next) => {
	try {
		const result = await contactsOperations.getContactById(req.params.id);
		res.json(result);
	} catch (error) {
		next(error);
	}
});

router.post("/", async (req, res, next) => {
	try {
		const { error } = contactSchema.validate(req.body);
		if (error) throw new BadRequest(error.message);

		const result = await contactsOperations.addContact(req.body);
		if (!result) {
			throw new Conflict(
				"this person is already in your contacts. (name, email or/and phone duplicates)"
			);
		}
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
});

router.delete("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await contactsOperations.removeContact(id);

		if (!result) {
			throw new NotFound(`Contact with id: ${id} not found`);
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
});

router.put("/:id", async (req, res, next) => {
	try {
		const { error } = contactSchema.validate(req.body);
		if (error) throw new BadRequest(error.message);

		const { id } = req.params;
		const result = await contactsOperations.updateContact(id, req.body);

		res.json(result);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
