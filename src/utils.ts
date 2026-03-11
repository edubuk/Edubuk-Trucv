
import instLogo1 from './assets/CLOGOS/instLogo1.png'
import instLogo2 from './assets/CLOGOS/instLogo2.png'
import instLogo3 from './assets/CLOGOS/instLogo3.png'
import instLogo4 from './assets/CLOGOS/instLogo4.png'
import instLogo5 from './assets/CLOGOS/instLogo5.png'

import gov1 from "./assets/Gov/gov-1.avif"
import gov2 from "./assets/Gov/gov-2.avif"
import gov3 from "./assets/Gov/gov-3.avif"
import gov4 from "./assets/Gov/gov-4.avif"
import gov5 from "./assets/Gov/gov-5.avif"
import gov6 from "./assets/Gov/gov-6.avif"
import gov7 from "./assets/Gov/gov-7.png"
import gov8 from "./assets/Gov/gov-8.png"
import gov9 from "./assets/Gov/gov-9.png"
import gov10 from "./assets/Gov/gov-10.png"
import gov11 from "./assets/Gov/gov-11.png"
import gov12 from "./assets/Gov/gov-12.png"
import gov13 from "./assets/Gov/gov-13.png"

import blcLogo1 from './assets/CLOGOS/blcLogo1.png'
import blcLogo2 from './assets/CLOGOS/blcLogo2.png'
import blcLogo3 from './assets/CLOGOS/blcLogo3.png'
import blcLogo4 from './assets/CLOGOS/blcLogo4.png'
import blcLogo5 from './assets/CLOGOS/blcLogo5.png'
import blcLogo6 from './assets/CLOGOS/blcLogo6.png'
import blcLogo7 from './assets/CLOGOS/blcLogo7.png'
import blcLogo8 from './assets/CLOGOS/blcLogo8.png'
import blcLogo9 from './assets/CLOGOS/blcLogo9.png'
import blcLogo10 from './assets/CLOGOS/blcLogo10.png'

import accLogo1 from './assets/CLOGOS/accLogo1.png'
import accLogo2 from './assets/CLOGOS/accLogo2.png'
import accLogo3 from './assets/CLOGOS/accLogo3.png'
import accLogo4 from './assets/CLOGOS/accLogo4.png'
import accLogo5 from './assets/CLOGOS/accLogo5.png'
import accLogo6 from './assets/CLOGOS/accLogo6.png'
import accLogo7 from './assets/CLOGOS/accLogo7.png'
import accLogo8 from './assets/CLOGOS/accLogo8.png'
import accLogo9 from './assets/CLOGOS/accLogo9.png'

import mediaLogo1 from './assets/CLOGOS/mediaLogo1.png'
import mediaLogo2 from './assets/CLOGOS/mediaLogo2.png'
import mediaLogo3 from './assets/CLOGOS/mediaLogo3.png'
import mediaLogo4 from './assets/CLOGOS/mediaLogo4.png'
import mediaLogo5 from './assets/CLOGOS/mediaLogo5.png'
import mediaLogo6 from './assets/CLOGOS/mediaLogo6.png'

import foreignLogo1 from './assets/CLOGOS/foreignLogo1.png'
import foreignLogo2 from './assets/CLOGOS/foreignLogo2.png'
import foreignLogo3 from './assets/CLOGOS/foreignLogo3.png'
import foreignLogo4 from './assets/CLOGOS/foreignLogo4.png'
import foreignLogo5 from './assets/CLOGOS/foreignLogo5.png'
import foreignLogo6 from './assets/CLOGOS/foreignLogo6.png'

import finLogo1 from './assets/CLOGOS/finLogo1.png'
import finLogo2 from './assets/CLOGOS/finLogo2.png'
import finLogo3 from './assets/CLOGOS/finLogo3.png'
import finLogo4 from './assets/CLOGOS/finLogo4.png'
import finLogo5 from './assets/CLOGOS/finLogo5.png' 
import finLogo6 from './assets/CLOGOS/finLogo6.png' 

import university1 from "./assets/University-Partners/University-1.avif"
import university2 from "./assets/University-Partners/University-2.avif"
import university3 from "./assets/University-Partners/University-3.avif"
import university4 from "./assets/University-Partners/University-4.avif"
import university5 from "./assets/University-Partners/University-5.avif"
import university6 from "./assets/University-Partners/University-6.avif"
import university7 from "./assets/University-Partners/University-7.avif"
import university8 from "./assets/University-Partners/University-8.avif"
import university9 from "./assets/University-Partners/University-9.avif"
import university10 from "./assets/University-Partners/University-10.avif"
import university11 from "./assets/University-Partners/University-11.avif"
import university12 from "./assets/University-Partners/University-12.avif"
import university13 from "./assets/University-Partners/University-13.avif"
import university14 from "./assets/University-Partners/University-14.avif"
import university15 from "./assets/University-Partners/University-15.avif"
import university16 from "./assets/University-Partners/University-16.avif"
import university17 from "./assets/University-Partners/University-17.avif"
import university18 from "./assets/University-Partners/University-18.avif"
import university19 from "./assets/University-Partners/University-19.avif"
import university20 from "./assets/University-Partners/University-20.avif"


import international1 from "./assets/International-Partners/International-1.avif"
import international2 from "./assets/International-Partners/International-2.avif"
import international3 from "./assets/International-Partners/International-3.avif"
import international4 from "./assets/International-Partners/International-4.avif"
import international5 from "./assets/International-Partners/International-5.avif"
import international6 from "./assets/International-Partners/International-6.avif"
import international7 from "./assets/International-Partners/International-7.avif"
import international8 from "./assets/International-Partners/International-8.avif"
import international9 from "./assets/International-Partners/International-9.avif"




export const convertDateToString = (value: any): string | null => {
  if (value?.$d) {
    const stringDate = value.$d.toString();
    const splitArray = stringDate.split(" ");
    const modifiedDate = splitArray.slice(1, 4);
    const stringDate1 = modifiedDate.join(" ");
    return stringDate1;
  }
  return null;
};

export const instLogos = [instLogo1,instLogo2,instLogo3,instLogo4,instLogo5,instLogo1,instLogo2,instLogo3,instLogo4,instLogo5,instLogo1,instLogo2,instLogo3,instLogo4,instLogo5,instLogo1,instLogo2,instLogo3,instLogo4,instLogo5,instLogo1,instLogo2,instLogo3,instLogo4,instLogo5,instLogo1,instLogo2,instLogo3,instLogo4,instLogo5,instLogo1,instLogo2,instLogo3,instLogo4,instLogo5,instLogo1,instLogo2,instLogo3,instLogo4,instLogo5];
export const blcLogos =  [blcLogo1,blcLogo2,blcLogo3,blcLogo4,blcLogo5,blcLogo6,blcLogo7,blcLogo8,blcLogo9,blcLogo10,blcLogo1,blcLogo2,blcLogo3,blcLogo4,blcLogo5,blcLogo6,blcLogo7,blcLogo8,blcLogo9,blcLogo10];
export const govLogos =  [gov1,gov2,gov3,gov4,gov5,gov6,gov7,gov8,gov9,gov10,gov11,gov12,gov13,gov1,gov2,gov3,gov4,gov5,gov6,gov7];
export const finLogos =  [finLogo1,finLogo2,finLogo3,finLogo4,finLogo5,finLogo6,finLogo1,finLogo2,finLogo3,finLogo4,finLogo5,finLogo6,finLogo1,finLogo2,finLogo3,finLogo4,finLogo5,finLogo6,finLogo1,finLogo2];
export const foreignLogos = [foreignLogo1,foreignLogo2,foreignLogo3,foreignLogo4,foreignLogo5,foreignLogo6,foreignLogo1,foreignLogo2,foreignLogo3,foreignLogo4,foreignLogo5,foreignLogo6,foreignLogo1,foreignLogo2,foreignLogo3,foreignLogo4];
export const accLogos = [accLogo1,accLogo2,accLogo3,accLogo4,accLogo5,accLogo6,accLogo7,accLogo8,accLogo9,accLogo1,accLogo2,accLogo3,accLogo4,accLogo5,accLogo6,accLogo7,accLogo8,accLogo9,accLogo1,accLogo2];
export const mediaLogos = [mediaLogo1,mediaLogo2,mediaLogo3,mediaLogo4,mediaLogo5,mediaLogo6,mediaLogo1,mediaLogo2,mediaLogo3,mediaLogo4,mediaLogo5,mediaLogo6,mediaLogo1,mediaLogo2,mediaLogo3,mediaLogo4,mediaLogo5,mediaLogo6,mediaLogo1,mediaLogo2];
export const internationalLogos = [international1,international2,international3,international4,international5,international6,international7,international8,international9,international1,international2,international3,international4,international5,international6,international7,international8,international9,international1,international2];
export const universityLogos = [university1,university2,university3,university4,university5,university6,university7,university8,university9,university10,university11,university12,university13,university14,university15,university16,university17,university18,university19,university20];
