export default async function handler(req,res){
 if(req.method!=="GET") return res.status(405).end();

 const q=(req.query.q||"").toLowerCase();
 const url=process.env.SUPABASE_URL + 
 `/rest/v1/guest_parties?select=party_id,display_name,members&or=(display_name.ilike.*${q}*,primary_name.ilike.*${q}*)`;

 const r=await fetch(url,{
   headers:{apikey:process.env.SUPABASE_ANON_KEY}
 });
 const data=await r.json();
 res.json({results:data});
}