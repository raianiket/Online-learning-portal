const Course = require('../models/Course')

exports.deleteCourseProcess = (req, res) => {
  let courseId = req.params.id;
  Course.findByIdAndRemove(courseId)
      .then(() => {
        res.redirect('/courses/listCourses');
      })
}

exports.updateCourseProcess = (req, res) => {
    const { name, description, photo, duration } = req.body
    const id=req.params.id
    Course.findOne({ _id: Object(id) })
        .then(course => {
            course.name = name
            course.description = description
            course.photo = photo
            course.duration = duration
            
            return course.save()
        })
        .then(course => {
            res.redirect('/courses/listCourses')
        })
}

exports.updateCourse = (req, res) => {
    const { id }=req.params
    Course.findOne({_id: Object(id)})
    
    .then((data)=>{
        
        res.render('updateCourse', {
            data: data,
            title: 'LMS | Update Course',
        })
    })
}

exports.createCourseProcess = (req, res) => {
    const { name, description, photo, duration } = req.body
    
    const course = new Course()
    course.name = name
    course.description = description
    course.photo = photo
    course.duration = Number(duration)
    
    course.save()
        .then(() => res.redirect('/courses/listCourses'))
        .catch(err => res.status(400).json(err))
}

exports.createCourse = (req, res) => {
    const data = {
        title: 'LMS | Add Course',
        errors: req.session.errors
    }
    
    req.session.errors = {}
    
    res.render('createCourse', data)
}

exports.listCourses = (req, res) => {
    Course.find()
        .then(courses => {
            const data = {
                title: 'LMS | List of Courses',
                courses
            }
            
            res.render('listCourses', data)
        })
        .catch(err => {
            res.json(err)
        })
}