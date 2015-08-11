/*!
 * @license PIPlayer v0.3.15
 * Copyright 2013-2015 Project Implicit
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define("pipScorer/computeD",["require","jquery"],function(r){function e(){a.extend(this,{dataArray:{},AnalyzedVar:"latency",ErrorVar:"error",condVar:"",cond1VarValues:[],cond2VarValues:[],parcelVar:"",parcelValue:[],fastRT:300,maxFastTrialsRate:.1,minRT:400,maxRT:1e4,maxErrorParcelRate:.4,errorLatency:{use:"latency",penalty:600,useForSTD:!0},postSettings:{}})}var a=r("jquery");return a.extend(e.prototype,{setComputeObject:function(r){a.extend(this,r)},setDataArray:function(){var r=window.piGlobal;this.dataArray=r.current.logs}}),e}),define("pipScorer/msgMan",["require","underscore"],function(r){function e(){this.messages=a.extend({},t)}var a=r("underscore"),t={MessageDef:[],manyErrors:"There were too many errors made to determine a result.",tooFast:"There were too many fast trials to determine a result.",notEnough:"There were not enough trials to determine a result."};return a.extend(e.prototype,{setMsgObject:function(r){a.extend(this.messages,r)},getScoreMsg:function(r){var e=this.messages.MessageDef;if(!e||!e.length)throw new Error('You must define a "MessageDef" array.');var t=parseFloat(r),n=null,o=null,s="error: msg was not set",c=!1;if(a.each(e,function(r){n=parseFloat(r.cut),o=r.message,n>=t&&!c&&(s=o,c=!0)}),!c){var i=e.length,u=e[i-1];s=u.message}return s},getMessage:function(r){return this.messages[r]}}),e}),define("pipScorer/parcelMng",["require","underscore"],function(r){function e(r){this.parcelArray=[],this.scoreData={},this.msgMan=r}var a=r("underscore");return a.extend(e.prototype,{Init:function(r){var e=this,t=this.msgMan,n=window.piGlobal,o=n.current.logs;e.parcelArray=[],e.scoreData={},e.msgMan=t;var s=r.AnalyzedVar,c=r.ErrorVar,i=r.parcelVar,u=r.parcelValue,l=r.minRT,g=r.maxRT,h=r.fastRT,p=0,d=0,f=0,v=0,m=parseFloat(r.maxFastTrialsRate);if("undefined"==typeof u||0===u.length){f=0,p=0,d=0,v=0;var y={};y.name="general",y.trialIData=[],a.each(o,function(a){a[s]>=l&&a[s]<=g?(f++,1==a.data[c]&&v++,e.validate(y,a,r)&&p++):a[s]<=h&&d++}),e.checkErrors(f,v,r),e.parcelArray[0]=y}else a.each(u,function(t,n){f=0,p=0,d=0,v=0;var u={};u.name=t,u.trialIData=[],a.each(o,function(a){var n=a.data[i];n==t&&(a[s]>=l&&a[s]<=g?(f++,1==a.data[c]&&v++,e.validate(u,a,r)&&p++):a[s]<=h&&d++)}),e.checkErrors(f,v,r),e.parcelArray[n]=u});d/p>m&&(e.scoreData.errorMessage=this.msgMan.getMessage("tooFast"))},checkErrors:function(r,e,a){var t=a.maxErrorParcelRate;e/r>t&&(this.scoreData.errorMessage=this.msgMan.getMessage("manyErrors"))},validate:function(r,e,a){var t=a.errorLatency,n=a.ErrorVar,o=e.data;return"latency"==t.use?(r.trialIData.push(e),!0):"false"==t.use?"1"==o[n]?!1:(r.trialIData.push(e),!0):"penalty"==t.use?(r.trialIData.push(e),!0):void 0},addPenalty:function(r,e){var t=e.errorLatency,n=this;if("penalty"==t.use){var o=parseFloat(t.penalty),s=e.ErrorVar,c=e.AnalyzedVar,i=e.condVar,u=e.cond1VarValues,l=e.cond2VarValues,g=r.trialIData,h=r.avgCon1,p=r.avgCon2;a.each(g,function(r){var e=r.data,a=e[s],t=e[i],g=n.checkArray(t,u),d=n.checkArray(t,l);"1"==a&&(g?r[c]+=h+o:d&&(r[c]+=p+o))})}},avgAll:function(r){var e=this;a.each(e.parcelArray,function(a){e.avgParcel(a,r)})},avgParcel:function(r,e){var t=this,n=r.trialIData,o=e.condVar,s=e.cond1VarValues,c=e.cond2VarValues,i=e.AnalyzedVar,u=0,l=0,g=0,h=0,p=0,d=0;a.each(n,function(r){var e=r[i],a=r.data;g+=e,d++;var n=a[o],f=t.checkArray(n,s),v=t.checkArray(n,c);f?(h++,u+=e):v&&(p++,l+=e)}),(2>=h||2>=p)&&(t.scoreData.errorMessage=this.msgMan.getMessage("notEnough")),0!==h&&(u/=h),0!==p&&(l/=p),r.avgCon1=u,r.avgCon2=l,r.diff=r.avgCon1-r.avgCon2,0!==d&&(r.avgBoth=g/d),t.addPenalty(r,e)},checkArray:function(r,e){for(var a=0;a<e.length;a++){var t=e[a];if(t==r)return!0}return!1},varianceAll:function(r){var e=this;a.each(e.parcelArray,function(a){e.varianceParcel(a,r)})},varianceParcel:function(r,e){var t=this,n=e.AnalyzedVar,o=r.trialIData,s=e.cond1VarValues,c=e.cond2VarValues,i=e.condVar,u=r.avgBoth,l=0,g=0,h=[],p=[],d=[],f=e.errorLatency,v=f.useForSTD;a.each(o,function(r){var a=r.data,o=r[n],u=e.ErrorVar,l=a[u],g=a[i],d=t.checkArray(g,s),f=t.checkArray(g,c);d?v?h.push(o):"0"==l&&h.push(o):f&&(v?p.push(o):"0"==l&&h.push(o))}),d=h.concat(p),a.each(d,function(r){var e=r;l=e-u,g+=l*l}),r.variance=g/(d.length-1)},scoreAll:function(r){var e=this,t=0;a.each(e.parcelArray,function(a){e.scoreParcel(a,r),t+=a.score});var n=t/e.parcelArray.length;e.scoreData.score=n.toFixed(2)},scoreParcel:function(r){var e=this,a=Math.sqrt(r.variance);0===a?(e.scoreData.errorMessage=this.msgMan.getMessage("notEnough"),r.score=r.diff):r.score=r.diff/a}}),e}),define("pipScorer/Scorer",["require","jquery","./computeD","./msgMan","./parcelMng"],function(r){function e(){this.computeData=new t,this.msgMan=new n,this.parcelMng=new o(this.msgMan)}var a=r("jquery"),t=r("./computeD"),n=r("./msgMan"),o=r("./parcelMng");return!!window.console||(console={log:a.noop,error:a.noop}),console.log||(console.log=a.noop),a.extend(e.prototype,{addSettings:function(r,e){switch(r){case"compute":this.computeData.setComputeObject(e);break;case"message":this.msgMan.setMsgObject(e);break;default:throw new Error('SCORER:addSettings: unknow "type" '+r)}},computeD:function(){var r=this.computeData,e=this.parcelMng;r.setDataArray(),e.Init(r),e.avgAll(r),e.varianceAll(r),e.scoreAll(r);var a=e.scoreData;return void 0===a.errorMessage||null===a.errorMessage?{FBMsg:this.getFBMsg(a.score),DScore:a.score,error:!1}:{FBMsg:a.errorMessage,DScore:"",error:!0}},postToServer:function(r,e,t,n){var o=this.computeData.postSettings||{},s=o.url,c={};return t||(t=o.score),n||(n=o.msg),c[t]=r,c[n]=e,a.post(s,JSON.stringify(c))},dynamicPost:function(r){var e=this.computeData.postSettings||{},t=e.url;return a.post(t,JSON.stringify(r))},getFBMsg:function(r){var e=this.msgMan.getScoreMsg(r);return e}}),e}),define("pipScorer",["pipScorer/Scorer"],function(r){return r});