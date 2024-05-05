import React, { useState } from 'react'
import {useSelector,useDispatch} from "react-redux"
import {useLocation} from "react-router-dom"
import { resetPassword } from '../services/operations/authAPI'
import {AiFillEye,AiFillEyeInvisible} from "react-icons/ai"
import { Link } from 'react-router-dom'

const UpdatePassword = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const [formData,setFormData] = useState({
        password:"",
        confirmPassword:"",
    })
    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)
    const {loading} = useSelector((state) => state.auth)
    const {password,confirmPassword} = formData

    const handleOnChange = (e) => {
        setFormData((prevData) => (
            {
                ...prevData,
                [e.target.name]: e.target.value
            }
        ))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password,confirmPassword,token))
    }

  return (
    <div className='text-white'>
      {
        loading?(
            <div>
                Loading....
            </div>
        ):(
            <div>
                <h1>Choose New Password</h1>
                <p>Almost done. Enter your new password and youre all set.</p>
                <form onSubmit={handleOnSubmit}>
                    <label>
                        <p>New Password<sup>*</sup></p>
                        <input
                        required
                        type={showPassword?"text":"password"}
                        name='password'
                        value={password}
                        onChange={handleOnChange}
                        placeholder='Password'
                        className='w-full p-6 bg-richblack-600 text-richblack-5'
                        />
                        <span
                            onClick={() => setShowPassword((prev)=> !prev)}
                        >
                            {
                                showPassword?<AiFillEyeInvisible fontSize={24}/>
                                :<AiFillEye fontSize={24}/>
                            }
                        </span>
                    </label>
                    <label>
                        <p>Confirm New Password<sup>*</sup></p>
                        <input
                        required
                        type={showConfirmPassword?"text":"password"}
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={handleOnChange}
                        placeholder='Confirm Password'
                        className='w-full p-6 bg-richblack-600 text-richblack-5'
                        />
                        <span
                            onClick={() => setShowConfirmPassword((prev)=> !prev)}
                        >
                            {
                                showConfirmPassword?<AiFillEyeInvisible fontSize={24}/>
                                :<AiFillEye fontSize={24}/>
                            }
                        </span>
                    </label>
                    <button type='Submit'>
                        Reset Password
                    </button>
                </form>
                <div>
                    <Link to="/login">
                        <p>Back to Login</p>
                    </Link>
                </div>
            </div>
        )
      }
    </div>
  )
}

export default UpdatePassword
