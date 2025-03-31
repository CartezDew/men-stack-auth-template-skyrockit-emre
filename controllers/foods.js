import express from "express";
import User from "../models/user.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.session.user);

    res.render("foods/index.ejs", {
      user: req.session.user,
      pantry: user.pantry,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

router.get("/new", (req, res) => {
  try {
    res.render("foods/new.ejs", { user: req.session.user });
  } catch (error) {
    console.error(error);
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.session.user._id);

    user.pantry.push({
      name
    });

    await user.save();
    // Redirect the user to the /users/userId/applications
    res.redirect(`/users/${req.session.user._id}/foods`);
  } catch (error) {
    console.error(error);
    res.send("There was an error creating the menu.");
  }
});

// PUT
router.get("/:itemId/edit", async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    const food = user.pantry.id(req.params.itemId);
    res.render("foods/edit.ejs", { user: req.session.user, food: food });
  } catch (error) {
    console.error(error);
  }
});

router.put('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    const food = user.pantry.id(req.params.itemId);
    if (!food) throw new Error('Food item not found');

    food.name = req.body.name; 
    await user.save();

    res.redirect(`/users/${req.session.user._id}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});


// DELETE

router.delete('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    const food = user.pantry.id(req.params.itemId)
    console.log(food)
    food.deleteOne();
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});



export default router;
     