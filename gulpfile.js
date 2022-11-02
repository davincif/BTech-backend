import gulp from "gulp";
import uglify from "gulp-uglify";
import { deleteSync } from "del";

const buildDir = "./dist/";
const srcDir = "src/**/*.js";

gulp.task("cleanBuild", (cb) => {
  deleteSync(buildDir);
  cb();
});

gulp.task("bundeJS", (cb) => {
  gulp.src(srcDir).pipe(uglify()).pipe(gulp.dest(buildDir, {}));
  cb();
});

export default gulp.series(["cleanBuild", "bundeJS"]);
