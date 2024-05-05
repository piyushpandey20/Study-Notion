import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import {resetCart} from "../../slices/cartSlice"
import { useSelector } from "react-redux";

const { studentEndpoints } = require("../apis");
const {COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints

function loadScript(src){
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

export async function buyCourse(token,courses,userDetails,navigate,dispatch){
    const toastId = toast.loading("Loading....")
    // console.log("courses",courses)
    try{
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        if(!res){
            toast.error("Razorpay sdk failed to load")
            return
        }
        // console.log("front",token)
        //initate the 
        const orderResponse = await apiConnector("POST",COURSE_PAYMENT_API,
        {courses,},
        {
            Authorization:`Bearer ${token}`
        })
        // console.log("object",orderResponse)

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message)
        }

        //options
        const options = {
            key:process.env.RAZORPAY_KEY,
            currency:orderResponse.data.message.currency,
            amount:`${orderResponse.data.message.amount}`,
            order_id:orderResponse.data.message.id,
            name:"StudtNotion",
            description:"Thank you for purchasing the course",
            image:{rzpLogo},
            prefill:{
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler:function(response){
                sendPaymentSuccessEmail(response,orderResponse.data.message.amount,token)
                verifyPayment({...response,courses},token,navigate,dispatch)
                
            }
        }
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
        paymentObject.on("payment.failed",function(response){
            toast.error("oops,payment failed")
            console.log(response.error)
        })

    }catch(error){
        console.log("Payment api error....",error)
        toast.error("could not make payment")
    }
    toast.dismiss(toastId)
}

async function sendPaymentSuccessEmail(response,amount,token){
    try{
        // console.log("Abhi tgak shi tha")
        await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,{
            orderId:response.razorpay_order_id,
            paymentId:response.razorpay_payment_id,
            amount,
        },{
            Authorization:`Bearer ${token}`
        })
    }catch(error){
        console.log("Payment success email error",error)
    }
}

async function verifyPayment(bodyData,token,navigate,dispatch){
    const toastId = toast.loading("Verifying payment....")
    dispatch(setPaymentLoading(true))
    try{    
        // console.log("inside verifying pay")
        const response = await apiConnector("POST",COURSE_VERIFY_API,bodyData,{
            Authorization:`Bearer ${token}`,
        })
        // console.log("response",response)
        // console.log("bodyData",bodyData)
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("Payment successful,you are added to the course")
        navigate("/dashboard/enrolled-courses")
        dispatch(resetCart())
    }catch(error){
        console.log("Payment verify error....",error)
        toast.error("Could not verify payment")
    }
    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
}