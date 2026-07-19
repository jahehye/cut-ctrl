export const photos = [
  "/images/hero-primary.webp",
  "/images/cut-2.webp",
  "/images/cut-3.webp",
  "/images/cut-4.webp",
  "/images/cut-5.webp",
  "/images/cut-6.webp",
  "/images/cut-7.webp",
  "/images/cut-8.webp"
];
export type Service = { code:string; name:string; description:string; duration:number; price:number; category:string; maintenance:string; barber:string; image:string };
export const services: Service[] = [
 {code:"C01",name:"Skin Fade",description:"Seamless zero-to-skin blend with a sharp finish.",duration:45,price:28,category:"Fades",maintenance:"2–3 weeks",barber:"Fade specialist",image:photos[0]},
 {code:"C02",name:"Textured Crop",description:"Controlled shape up top. Movement where it counts.",duration:40,price:30,category:"Core Cuts",maintenance:"3–4 weeks",barber:"Texture specialist",image:photos[1]},
 {code:"C03",name:"Classic Cut",description:"Scissor-led structure with a clean taper.",duration:35,price:26,category:"Core Cuts",maintenance:"4–5 weeks",barber:"Scissor specialist",image:photos[2]},
 {code:"F04",name:"Burst Fade",description:"A tight curved fade built around the ear.",duration:45,price:32,category:"Fades",maintenance:"2–3 weeks",barber:"Fade specialist",image:photos[3]},
 {code:"B01",name:"Beard Reset",description:"Shape, line, detail and a clean finish.",duration:25,price:18,category:"Beard",maintenance:"2 weeks",barber:"Beard specialist",image:photos[4]},
 {code:"P01",name:"Cut + Beard",description:"One complete reset, timed and balanced together.",duration:65,price:42,category:"Packages",maintenance:"3 weeks",barber:"All-rounder",image:photos[5]},
 {code:"S01",name:"Student Cut",description:"Full service. Student rate. Never rushed.",duration:35,price:24,category:"Students",maintenance:"3–4 weeks",barber:"Any level",image:photos[6]},
 {code:"R01",name:"Full Restyle",description:"Consult, rebuild and finish a new direction.",duration:70,price:38,category:"Restyles",maintenance:"4–6 weeks",barber:"Creative director",image:photos[7]},
 {code:"A01",name:"Line Up",description:"Edges reset between full appointments.",duration:15,price:12,category:"Add-ons",maintenance:"1–2 weeks",barber:"Any level",image:photos[0]},
];
export type Barber = {name:string;number:string;specialty:string;experience:string;days:string;rating:string;quote:string;image:string;tags:string[]};
export const barbers: Barber[] = [
 {name:"Jay Cole",number:"01",specialty:"Skin fades / sharp detail",experience:"7 years",days:"Tue — Sat",rating:"4.9",quote:"I build the cut around how you actually wear it.",image:photos[3],tags:["Fades","Creative Cuts"]},
 {name:"Marco Vale",number:"02",specialty:"Texture / restyles",experience:"9 years",days:"Mon — Fri",rating:"5.0",quote:"Structure first. Then we make it feel like yours.",image:photos[1],tags:["Scissor Cuts","Restyles"]},
 {name:"Liam Knox",number:"03",specialty:"Classic / scissor work",experience:"6 years",days:"Wed — Sat",rating:"4.8",quote:"A good cut should still work three weeks later.",image:photos[2],tags:["Scissor Cuts","Beards"]},
 {name:"Zen Park",number:"04",specialty:"Creative cuts / beards",experience:"5 years",days:"Tue — Sat",rating:"4.9",quote:"Bring references. Leave with something specific to you.",image:photos[6],tags:["Creative Cuts","Beards","Fades"]}
];
export const looks = [
 {id:1,cut:"Textured Crop",barber:"Marco",hair:"Straight / thick",notes:"Matte clay, broken finish",maintenance:"Medium",image:photos[0],category:"Texture"},
 {id:2,cut:"Low Static",barber:"Jay",hair:"Wavy",notes:"Low fade, natural movement",maintenance:"Low",image:photos[3],category:"Fades"},
 {id:3,cut:"Soft Taper",barber:"Liam",hair:"Fine",notes:"Scissor shape, soft taper",maintenance:"Low",image:photos[2],category:"Classic"},
 {id:4,cut:"Hard Reset",barber:"Zen",hair:"Coarse",notes:"Graphic line, burst fade",maintenance:"High",image:photos[6],category:"Creative"},
 {id:5,cut:"Clean Frame",barber:"Zen",hair:"Beard",notes:"Squared line, natural weight",maintenance:"Medium",image:photos[4],category:"Beard"},
 {id:6,cut:"Room 01",barber:"Crew",hair:"Studio",notes:"Saturday shift",maintenance:"—",image:photos[7],category:"Studio"}
];
