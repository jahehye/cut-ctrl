import type {Metadata} from "next"; import {PageHero} from "@/components/ui"; import {LookbookGrid} from "@/components/LookbookGrid";
export const metadata:Metadata={title:"Lookbook",description:"Explore fades, texture, classic cuts, beard work and creative looks by CUT/CTRL."};
export default function Lookbook(){return <><PageHero number="03" title="Lookbook" copy="Reference material from real directions. Save what feels close."/><section className="section"><LookbookGrid/></section></>}
