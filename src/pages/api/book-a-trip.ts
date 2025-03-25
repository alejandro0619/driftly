export const prerender = false;

import type { APIRoute } from "astro"
import { supabase } from "../../lib/supabase"


export const GET: APIRoute = ({ params, request }) => {

  return new Response(JSON.stringify({
    message: "¡Esto es un GET!" + JSON.stringify(params)
  })
  )
}

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const { email, nombre, apellido, destiny_name, ticket_name, departure_date, return_date, passenger_name, passenger_passport_id } = body;

    const { data, error } = await supabase.from("user").insert([
      { email, nombre, apellido }
    ]).select("id");

    console.log(data![0].id, error);
    const { data: destiny_data, error: destiny_error } = await supabase.from("destiny").insert([
      { name: destiny_name }
    ]).select("id");

    const { data: ticket_data, error: ticket_error } = await supabase.from("ticket").insert([
      {
        name: ticket_name,
        departure_date: departure_date,
        return_date: return_date,
        passenger_name: `${nombre} ${apellido}`,
        passenger_passport_id,
        userId: data![0].id,
        destinyId: destiny_data![0].id
      }
    ]).select("id");

    return new Response(JSON.stringify({
      message: "Tu nombre fue: " + nombre
    }), {
      status: 200
    })
  }
  return new Response(null, { status: 400 });
};

