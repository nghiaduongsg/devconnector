const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Profile = require('../models/Profile');
const User = require('../models/User');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');
// @route   GET api/profile/test
// @desc    Tests profile routes
// @access  Public
router.get('/test', (req, res) => res.json({msg: "Profile works"}));
const errors = {};

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user'
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public

router.get('/all', (req, res) => {
  Profile.find()
    .populate('user', ['name','avatar'])
    .then(profiles => {
      if(!profiles) {
        errors.noprofile = "There's no profile";
        res.status(404).json(errors)
      }
      res.json(profiles)
    })
    .catch(err => res.status(404).json({ profile: "There is no profile"}))
})

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:handle', (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name','avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = "There's no profile for that user";
        res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public

router.get('/user/:user_id', (req, res) => {
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name','avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = "There's no profile for that user";
        res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json( {noprofile: "There's no profile for that user"} ))
})

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const {errors, isValid} = validateProfileInput(req.body);

    // Check validation
    if(!isValid) {
      return res.status(400).json(errors)
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.status) profileFields.status = req.body.status;
    // Skills - Split into Array
    if(typeof req.body.skills !== 'undefined') profileFields.skills = req.body.skills.split(',');

    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Social
    profileFields.social = {}
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;

    if(req.body.date) profileFields.date = req.body.date;

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if(profile) {
          //Found a profile, update
          Profile.findOneAndUpdate(
            {user: req.user.id},
            { $set: profileFields },
            { new: true }
          )
          .then(profile => res.json(profile))
        } else {
          // Couldn't find profile, create new
          // Check if handle exists
          Profile.findOne({ handle: profileFields.handle})
            .then( profile => {
              if (profile) {
                errors.handle = 'That handle already existed';
                res.status(400).json(errors)
              }
              // Save profile
              new Profile(profileFields).save()
                .then(profile => res.json(profile))
            

            })
        }
      })

  }
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private


router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const {errors, isValid} = validateExperienceInput(req.body);
  if(!isValid) {
    res.status(400).json(errors)
  }
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      // Add to experience profile
      profile.experience.unshift(newExp);
      profile.save()
        .then(profile => res.json(profile))
        .catch(err => res.json(err))
    })
})
// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private


router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const {errors, isValid} = validateEducationInput(req.body);
  if(!isValid) {
    res.status(400).json(errors)
  }
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      // Add to education profile
      profile.education.unshift(newEdu);
      profile.save()
        .then(profile => res.json(profile))
        .catch(err => res.json(err))
    })
    .catch(err => res.json(err))
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience of the profile
// @access  Private

router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
      // Splice the experience array with removeIndex
      profile.experience.splice(removeIndex, 1);
      profile.save()
        .then(profile => res.json(profile))
    })
    .catch(err => res.status(404).json({ err }))  
})
// @route   DELETE api/profile/education/:exp_id
// @desc    Delete education of the profile
// @access  Private

router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);
      // Splice the experience array with removeIndex
      profile.education.splice(removeIndex, 1);
      profile.save()
        .then(profile => res.json(profile))
    })
    .catch(err => res.status(404).json({ err }))  
})

// @route   DELETE api/profile/
// @desc    Delete user & profile
// @access  Private

router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      User.findOneAndRemove({ _id: req.user.id })
        .then(() => res.json( {success: true} ))
    })
    .catch(err => res.status(404).json({ err }))  
})

module.exports = router;