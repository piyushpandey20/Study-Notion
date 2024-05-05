import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { VscAdd } from "react-icons/vsc"
import { useNavigate } from 'react-router-dom'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI'
import Iconbtn from '../../common/Iconbtn'
import CoursesTable from './InstructorCourses/CoursesTable'

const MyCourses = () => {

    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [courses,setCourses] = useState([])

    useEffect(() => {
        const fetchCourses = async() => {
            const result = await fetchInstructorCourses(token)
            if(result){
                setCourses(result)
            }
        }
        fetchCourses()
    },[])

  return (
    <div>
        <div className="mb-14 flex items-center justify-between">
            <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
            <Iconbtn
                text="Add Course"
                onclick={() => navigate("/dashboard/add-course")}
            >
                <VscAdd />
            </Iconbtn>
        </div>

        {courses && <CoursesTable courses={courses} setCourses={setCourses} />}

    </div>
  )
}

export default MyCourses
