(self.webpackChunkwidgets=self.webpackChunkwidgets||[]).push([[2734],{11270:r=>{"use strict";r.exports=`/* motionPad theme for G-code languages */\r
/* \r
  sepia: #fdeecc - background/body\r
  olive - #780 - main color\r
  light green (teal) - #088 - main color ??\r
  indigo - #78B - parameters in function\r
  cyan: #2A9 - for function calls\r
  blue: #0077AC - function/tags\r
  green: #094 - function names \r
  yellow: #B82 - ? - use as active row\r
  orange: #F67A00 - used below in hashtags/color defs/new / numbers / operators\r
  red/rosy: #DA2D2D - returns / switch\r
  purple: #9932cc  - undefined, true/false\r
  gray: #8d796b - selected row\r
  brown: #8b6d3c - strings\r
  silver: #888888  - comments\r
\r
\r
*/\r
\r
\r
.ace-codePadTheme .ace_gutter {\r
  background: #ecdebc;\r
  color: #890;\r
}\r
\r
.ace-codePadTheme  {\r
  background: #fdeecc;\r
  color: #088;\r
}\r
\r
.ace-codePadTheme .ace_identifier {\r
  color: #890;\r
}\r
\r
.ace-codePadTheme.ace-debugging {\r
    background-color: rgba(147,161,161, 0.4);\r
    color: #890;\r
}\r
\r
/* Comments, block-numbers */\r
.ace-codePadTheme .ace_comment {\r
  color: #888;\r
  font-style: italic;\r
}\r
\r
.ace-codePadTheme .ace_string.ace_start,\r
.ace-codePadTheme .ace_string.ace_end {\r
  color: #888;\r
}\r
\r
/* Strings */\r
.ace-codePadTheme .ace_string,\r
.ace-codePadTheme .ace_constant {  \r
  color: #8b6d3c;\r
}\r
\r
/* Numerical constants */\r
.ace-codePadTheme .ace_constant.ace_numeric {  \r
  color: #F67A00;\r
}\r
\r
/* Axis names and G-code arguments */\r
.ace-codePadTheme .ace_variable.ace_parameter {\r
  color: #6677aa;\r
  font-weight: bold;\r
  font-style: italic;\r
}\r
\r
/* Arithmetic operators */\r
.ace-codePadTheme .ace_keyword.ace_operator{\r
    color: #F67A00;\r
    font-weight: bold;\r
}\r
\r
/* Control keywords */\r
.ace-codePadTheme .ace_keyword.ace_control  {\r
  font-weight: bold;\r
  color: #094;\r
}\r
\r
/* Miscellaneous keywords */\r
.ace-codePadTheme .ace_keyword.ace_other {\r
  font-weight: bold;\r
  /*color: #0000FF;*/\r
}\r
\r
/* Commands - G-codes, M-functions and Technology functions */\r
.ace-codePadTheme .ace_support.ace_function {\r
  color: #0077AC;\r
}\r
\r
/* Data types */\r
.ace-codePadTheme .ace_support.ace_type {  \r
  color: #0077AC;\r
  font-weight: bold;\r
}\r
\r
/* Constants (MC_X, MC_NAME_P1, ...) */\r
.ace-codePadTheme .ace_support.ace_constant {\r
  color: #9932cc;\r
  font-weight: bold;\r
}\r
\r
/* System variables ($WFRAME, $RAD, ... ) */\r
.ace-codePadTheme .ace_support.ace_variable {\r
  font-weight: bold;\r
}\r
\r
/* Parentheses */\r
.ace-codePadTheme .ace_paren {\r
  font-weight: bold;\r
}\r
\r
.ace-codePadTheme .ace_cursor {\r
  color: black;\r
}\r
\r
/* active-line is for edit mode */\r
.ace-codePadTheme.ace_focus .ace_marker-layer .ace_active-line {\r
  background-color: rgba(139,109,60, 0.2);\r
}\r
.ace-codePadTheme .ace_marker-layer .ace_active-line {\r
  background-color: rgba(139,109,60, 0.2);\r
}\r
\r
.ace-codePadTheme .ace_marker-layer .ace_selection {\r
  background: rgba(93,190,137, 0.5);\r
}\r
\r
.ace-codePadTheme.ace_multiselect .ace_selection.ace_start {\r
  box-shadow: 0 0 3px 0px #888;\r
}\r
\r
/* bold keywords cause cursor issues for some fonts */\r
/* this disables bold style for editor and keeps for static highlighter */\r
.ace-codePadTheme.ace_nobold .ace_line > span {\r
    font-weight: normal !important;\r
}\r
\r
.ace-codePadTheme .ace_marker-layer .ace_step {\r
  background: rgba(187,136,34, 0.3);\r
}\r
\r
.ace-codePadTheme .ace_marker-layer .ace_stack {\r
  background: rgb(164, 229, 101);\r
}\r
\r
.ace-codePadTheme .ace_marker-layer .ace_bracket {\r
  margin: -1px 0 0 -1px;\r
  border: 1px solid rgb(192, 192, 192);\r
}\r
\r
.ace-codePadTheme .ace_gutter-active-line {\r
    background-color : rgba(0, 0, 0, 0.07);\r
}\r
\r
.ace-codePadTheme .ace_marker-layer .ace_selected-word {\r
  box-shadow: 0 0 3px 0px #888;\r
}\r
\r
.ace-codePadTheme .ace_invisible {\r
  color: #BFBFBF\r
}\r
\r
.ace-codePadTheme .ace_print-margin {\r
  width: 1px;\r
  background: #e8e8e8;\r
}\r
\r
.ace-codePadTheme .ace_indent-guide {\r
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==") right repeat-y;\r
}\r
`},40353:(r,t,a)=>{var n={"./brace.js":28910,"./codePadTheme.js":94030,"./motionPadTheme.js":67877};function d(o){var c=e(o);return a(c)}function e(o){if(!a.o(n,o)){var c=new Error("Cannot find module '"+o+"'");throw c.code="MODULE_NOT_FOUND",c}return n[o]}d.keys=function(){return Object.keys(n)},d.resolve=e,r.exports=d,d.id=40353},61071:r=>{"use strict";r.exports=`/* motionPad theme for G-code languages */\r
\r
.ace-motionPadTheme .ace_gutter {\r
  background: #e8e8e8;\r
  color: #AAA;\r
}\r
\r
.ace-motionPadTheme  {\r
  background: #fff;\r
  color: #000;\r
}\r
\r
.ace-motionPadTheme.ace-debugging {\r
    background-color: #D3D3D3;\r
    color: #000;\r
}\r
\r
/* Comments, block-numbers */\r
.ace-motionPadTheme .ace_comment {\r
  color: #998;\r
  font-style: italic;\r
}\r
\r
/* Strings */\r
.ace-motionPadTheme .ace_string.ace_start,\r
.ace-motionPadTheme .ace_string.ace_end,\r
.ace-motionPadTheme .ace_string {\r
  color: #D14;\r
}\r
\r
/* Numerical constants */\r
.ace-motionPadTheme .ace_constant.ace_numeric {  \r
  color: #F0F;\r
}\r
\r
/* Axis names and G-code arguments */\r
.ace-motionPadTheme .ace_variable.ace_parameter {\r
  font-weight: bold;\r
  font-style: italic;\r
}\r
\r
/* Arithmetic operators */\r
.ace-motionPadTheme .ace_keyword.ace_operator{\r
    font-weight: bold;\r
}\r
\r
/* Control keywords */\r
.ace-motionPadTheme .ace_keyword.ace_control  {\r
  font-weight: bold;\r
  color: #0000FF;\r
}\r
\r
/* Miscellaneous keywords */\r
.ace-motionPadTheme .ace_keyword.ace_other {\r
  font-weight: bold;\r
  /*color: #0000FF;*/\r
}\r
\r
/* Commands - G-codes, M-functions and Technology functions */\r
.ace-motionPadTheme .ace_support.ace_function {\r
  color: #0000FF;\r
}\r
\r
/* Data types */\r
.ace-motionPadTheme .ace_support.ace_type {  \r
  color: #070;\r
  font-weight: bold;\r
}\r
\r
/* Constants (MC_X, MC_NAME_P1, ...) */\r
.ace-motionPadTheme .ace_support.ace_constant {\r
  font-weight: bold;\r
}\r
\r
/* System variables ($WFRAME, $RAD, ... ) */\r
.ace-motionPadTheme .ace_support.ace_variable {\r
  font-weight: bold;\r
}\r
\r
/* Parentheses */\r
.ace-motionPadTheme .ace_paren {\r
  font-weight: bold;\r
}\r
\r
.ace-motionPadTheme .ace_cursor {\r
  color: black;\r
}\r
\r
.ace-motionPadTheme.ace_focus .ace_marker-layer .ace_active-line {\r
  background: rgb(255, 255, 204);\r
}\r
.ace-motionPadTheme .ace_marker-layer .ace_active-line {\r
  background: rgb(245, 245, 245);\r
}\r
\r
.ace-motionPadTheme .ace_marker-layer .ace_selection {\r
  background: rgb(181, 213, 255);\r
}\r
\r
.ace-motionPadTheme.ace_multiselect .ace_selection.ace_start {\r
  box-shadow: 0 0 3px 0px white;\r
}\r
\r
/* bold keywords cause cursor issues for some fonts */\r
/* this disables bold style for editor and keeps for static highlighter */\r
.ace-motionPadTheme.ace_nobold .ace_line > span {\r
    font-weight: normal !important;\r
}\r
\r
.ace-motionPadTheme .ace_marker-layer .ace_step {\r
  background: rgb(252, 255, 0);\r
}\r
\r
.ace-motionPadTheme .ace_marker-layer .ace_stack {\r
  background: rgb(164, 229, 101);\r
}\r
\r
.ace-motionPadTheme .ace_marker-layer .ace_bracket {\r
  margin: -1px 0 0 -1px;\r
  border: 1px solid rgb(192, 192, 192);\r
}\r
\r
.ace-motionPadTheme .ace_gutter-active-line {\r
    background-color : rgba(0, 0, 0, 0.07);\r
}\r
\r
.ace-motionPadTheme .ace_marker-layer .ace_selected-word {\r
  background: rgb(250, 250, 255);\r
  border: 1px solid rgb(200, 200, 250);\r
}\r
\r
.ace-motionPadTheme .ace_invisible {\r
  color: #BFBFBF\r
}\r
\r
.ace-motionPadTheme .ace_print-margin {\r
  width: 1px;\r
  background: #e8e8e8;\r
}\r
\r
.ace-motionPadTheme .ace_indent-guide {\r
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==") right repeat-y;\r
}\r
`},67877:(r,t,a)=>{var n;n=function(d,e,o){e.isDark=!1,e.cssClass="ace-motionPadTheme",e.cssText=a(61071);var c=a(66455);c.importCssString(e.cssText,e.cssClass)}.call(t,a,t,r),n!==void 0&&(r.exports=n)},94030:(r,t,a)=>{var n;n=function(d,e,o){e.isDark=!0,e.cssClass="ace-codePadTheme",e.cssText=a(11270);var c=a(66455);c.importCssString(e.cssText,e.cssClass)}.call(t,a,t,r),n!==void 0&&(r.exports=n)}}]);
