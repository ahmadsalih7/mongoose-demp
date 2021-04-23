const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
.then(()=> console.log('Connected to mongodb....'))
.catch(err=> console.log(err.message));

//create schema 
var enu = {
    values: ['frontend', 'backend'],
    message: function(){return `The valid inputs are ${enu.values}`}
}
const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLenght: 3
    },
    author: String,
    tags: {
        type: Array,
        validate:{
            isAsync: true,
            validator: function(v,callback){
                setTimeout(()=>{
                    const result = v && v.lenght>0;
                    callback(result);
                }, 4000);
            },
            message: "A course must have at least one tags"
        }
    },
    date: {type:Date, default:Date.now},
    isPublished: Boolean,
    price: {
        type: Number,
        required: function(){return this.isPublished;}
    },
    category: {
        type: String,
        required: true,
        enum: enu
    }
});

const Course = mongoose.model('Course',courseSchema);
//Create model Class
async function createDocument(){
    const course = new Course({
        name: 'Angular Course',
        author: 'Mosh',
        tags: ['Angular', 'frontend'],
        isPublished: true,
        price: 20,
        category: 'backend'
        });
    try{
        const result = await course.save();
        console.log(result);
    }
    catch(err){
        console.log(err.message);
    }
}
async function getCourses(){
    const courses = await Course.update()
    find()
    .find({author:'Mosh', isPublished:true})
    .sort({name:1})
    .select({name:1, tags:1});
    console.log(courses);
}

async function updateCourse(id){
    const course = await Course.findById(id);
    if (!course) return;
    course.set({
        isPublished:true,
        author: 'Ahmed Mimo'
    });
    const result = await course.save();
    console.log(result);
}

async function updateCourseFirst(id){
    const course = await Course.findByIdAndUpdate(id,{
        $set:{
            author: 'Salah',
            isPublished: false
        }
    }, {new: true});
    console.log(course);
}
createDocument();