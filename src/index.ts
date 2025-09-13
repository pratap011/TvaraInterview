import express,{request, Request,Response} from 'express';
import {supabase} from './Utils/supabaseClient';
import dotenv from 'dotenv';
const app=express();


app.use(express.json());
dotenv.config();

type RequestBody={
    name:string,
    field_1:object,
    field_2:number,
    field_3:boolean
}

type updateRequestBody={
    fieldToBeUpdated: string,
    valueUpdated:any,
    condition:string,
    conditionValue:any
}

function authenticateBody(body:RequestBody):boolean{
    if (typeof body !== 'object' || body === null) {
        console.error("Validation failed: Body is not an object.");
        return false;
    }

    // field_1 must be a non-null object (representing a JSON object).
    // We also check it's not an array, as typeof [] is 'object'.
    if (typeof body.field_1 !== 'object' || body.field_1 === null || Array.isArray(body.field_1)) {
        console.error("Validation failed: field_1 must be a JSON object.");
        return false;
    }

    // field_2 must be an integer.
    if (typeof body.field_2 !== 'number' || !Number.isInteger(body.field_2)) {
        console.error("Validation failed: field_2 must be an integer.");
        return false;
    }

    // field_3 must be a boolean.
    if (typeof body.field_3 !== 'boolean') {
        console.error("Validation failed: field_3 must be a boolean.");
        return false;
    }

    // All checks passed
    return true;
}

app.get("/fetchData",async (req:Request,res:Response)=>{
    const {data,error}=await supabase.from("Interview_Tests").select("*");
    console.log(data);
})

app.post("/insertData",async (req:Request,res:Response)=>{

    const requestBody: RequestBody=req.body.body;
    
    try{
        if(authenticateBody(requestBody)){
            const {data,error}=await supabase.from("Interview_Tests").insert(requestBody);
        }
        else{
            res.status(400).json({message:"Bad Request! Please provide valid details"});
        }
    }
    catch(error:any){
        res.status(500).json({message:error});
    }
    

    

});

app.put("/updateData",async (req: Request,res: Response)=>{
    const requestBody:updateRequestBody=req.body.body;
    const fieldToBeUpdated=requestBody.fieldToBeUpdated
    const valueUpdated=requestBody.valueUpdated
    const condition=requestBody.condition
    const conditionValue=requestBody.conditionValue

    try{
        const { data, error } = await supabase
    .from('Interview_Tests"')
    .update({ fieldToBeUpdated: valueUpdated })  // columns to update
    .eq(condition, conditionValue)  // condition (WHERE)


    res.status(200).json({message:"Updated"})
    }
    catch(error:any){
        res.status(500).json({error});
    }
})





app.listen(8000,(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("The server has successfully started running on port 8000");
    }
})