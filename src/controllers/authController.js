import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// 1.--Register user -----
 
export  const registerUser = async (req,res) =>{
    try{
             const {name,email,password} =req.body;

             //2. Input validation
            if (!name || !email || !password){
                return res.status (400).json({
                success:false,
                message:"Please provode name, email and password"
            });
            }

            //3. check if email alreday exits
            const userExits = await  User.findOne({email});
            if (userExits){
                return res.status(400).json({
                success :false,
                message : "User already exists"
            });
            }

            
            //4 create new user
            const user =await User.create({name,email,password});

            // 5. Response with token
            return res.status (201).json({
                success:true,
                message:"User registered successfully",
                token:generateToken(user.id),
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email
                },
            });
    }catch(error){
      console.log(error,"...........................")
      return res.status(500).json({
      success: false,
      message: "Server error",
    });
}

};



// -------Login User -------

export const loginUser = async(req,res) =>{
    try{
        const {email,password}=req.body;
    
    //1.Validate input
    if (!email || !password){
        return res.status(400).json({
        success: false,
        message: "Please provide email and password",
        })
    }
    // 2. Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    console.log("Entered:", password);
console.log("DB Hash:", user.password);

    // 3. Compare passwords
   const isMatch = await bcrypt.compare(password, user.password);


    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    // 4. Send token + user data
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(error,"yyyyyyyyyyyyyyyy")
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
    