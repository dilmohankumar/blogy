const { Router } = require("express");
const multer = require("multer");
const router = Router();
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { error } = require("console");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;

  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImgURL: req.file ? `/uploads/${req.file.filename}` : null,
  });

  return res.redirect(`/blog/${blog._id}`);
});

router.get("/", async (req, res) => {
  const blog = await Blog.findById(req.query.id).populate(`createdBy`);
  console.log(blog)
  const comments=await Comment.find({blogId:req.query.id}).populate(`createdBy`);
  console.log(comments)
  
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog?id=${req.params.blogId}`);
});

router.get("/add-new", (req, res) => {

  return res.render("addBlog", {
    user: req.user,
  });
});



module.exports = router;
