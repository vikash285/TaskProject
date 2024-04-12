const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const xlsx = require("xlsx");

function isStringInvalid(string) {
  if (string === undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}

const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_TOKEN_KEY);
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ message: "Email or password is missing" });
    }
    const user = await User.findOne({ where: { email } });
    if (user !== null) {
      bcrypt.compare(password, user.dataValues.password, (err, response) => {
        if (err) {
          throw new Error("Something went wrong");
        } else if (response) {
          return res.status(200).json({
            message: "User logged in successfuly",
            user: user[0],
            token: generateToken(user.dataValues.id),
          });
        } else {
          return res.status(400).json({ message: "Password is incorrect" });
        }
      });
    } else {
      res.status(404).json({ message: "User does not exist" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const addUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (
      isStringInvalid(firstName) ||
      isStringInvalid(lastName) ||
      isStringInvalid(email) ||
      isStringInvalid(password)
    ) {
      return res
        .status(400)
        .json({ err: "Bad parameters, something is missing!" });
    }

    // Check for admin only when User table is not empty
    const users = await User.findByPk(1);
    if (users) {
      const isAdmin = req.user.isAdmin;
      if (isAdmin) {
        const user = await User.findOne({ where: { email } });
        if (user) {
          return res.status(400).json({ message: "Email should be unique!" });
        } else {
          bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
              throw new Error("Something went wrong");
            }

            await User.create({ firstName, lastName, email, password: hash });
            res.status(201).json({ message: "New user created!" });
          });
        }
      } else {
        res.status(404).json({ message: "Only admin can add users!" });
      }
    }
    // Else add first user staright to table
    else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          throw new Error("Something went wrong");
        }

        await User.create({
          firstName,
          lastName,
          email,
          password: hash,
          isAdmin: true,
        });
        res.status(201).json({ message: "First user created!" });
      });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const uploadUserData = (req, res) => {
  try {
    const isAdmin = req.user.isAdmin;
    const filePath = req.file.path;
    const workBook = xlsx.readFile(filePath);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);

    // filtering excel data to remove duplicates
    const uniqueJsonData = jsonData.filter((obj, index) => {
      return index === jsonData.findIndex((o) => o.email === obj.email);
    });

    if (isAdmin) {
      uniqueJsonData.forEach(async (element) => {
        try {
          const eleEmail = element.email;
          const user = await User.findOne({ where: { email: eleEmail } });
          if (!user) {
            bcrypt.hash(element.password.toString(), 5, async (err, hash) => {
              if (err) {
                throw new Error("Something went wrong");
              }

              await User.create({
                firstName: element.firstName,
                lastName: element.lastName,
                email: element.email,
                password: hash,
              });
            });
          }
        } catch (err) {
          return res.status(500).json(err);
        }
      });
      res.status(201).json({ message: "Add users request successful!" });
    } else {
      res.status(404).json({ message: "Only admin can add users!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Could not be uploaded!" });
  }
};

const getUsers = async (req, res) => {
  try {
    const isAdmin = req.user.isAdmin;
    if (isAdmin) {
      const users = await User.findAll();
      return res.status(200).json(users);
    } else {
      res.status(400).json({ message: "Only admin can get users!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Could not get users!" });
  }
};

module.exports = { addUser, logIn, generateToken, uploadUserData, getUsers };
