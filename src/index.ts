import express, { Request, Response } from 'express';
import { supabase } from './Utils/supabaseClient';
import dotenv from 'dotenv';
const app = express();


app.use(express.json());
dotenv.config();

type RequestBody = {
    name: string,
    field_1: object,
    field_2: number,
    field_3: boolean
}

function authenticateBody(body: RequestBody): boolean {

  
    if (typeof body.field_1 !== 'object' || body.field_1 === null || Array.isArray(body.field_1)) {
        console.error("Validation failed: field_1 must be a JSON object.");
        return false;
    }

  
    if (typeof body.field_2 !== 'number' || !Number.isInteger(body.field_2)) {
        console.error("Validation failed: field_2 must be an integer.");
        return false;
    }

    if (typeof body.field_3 !== 'boolean') {
        console.error("Validation failed: field_3 must be a boolean.");
        return false;
    }

    
    return true;
}

app.get("/fetchData", async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase.from("Interview_Tests").select("*");
        if (error) throw error;
        res.status(200).json(data);
    } catch (error: any) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: error.message });
    }
})

app.post("/insertData", async (req: Request, res: Response) => {
    
    const requestBody: RequestBody = req.body;

    try {
        if (!authenticateBody(requestBody)) {
            // 400 Bad Request for validation failures
            return res.status(400).json({ error: "Bad Request! Please provide valid details. Check field types." });
        }

    
        const { data, error } = await supabase.from("Interview_Tests").insert(requestBody).select();

        if (error) {
   
            throw error;
        }

      
        res.status(201).json({ message: "Data inserted successfully", data });
    }
    catch (error: any) {
        console.error("Error inserting data:", error);
        
        res.status(500).json({ error: error.message });
    }
})

//
app.put("/updateData/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatePayload = req.body;

    try {
        
        const { data, error } = await supabase
            .from('Interview_Tests') 
            .update(updatePayload)
            .eq('id', id) 
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            
            return res.status(404).json({ error: `Record with id ${id} not found.` });
        }

        res.status(200).json({ message: "Data updated successfully", data });
    } catch (error: any) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: error.message });
    }
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`The server has successfully started running on port ${PORT}`);
})
