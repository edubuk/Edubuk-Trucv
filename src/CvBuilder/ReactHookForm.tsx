import { useForm } from "react-hook-form"
type formData={
    name:string;
    email:string;
    phone:number
}
const ReactHookForm = ()=>{
    const form = useForm<formData>();
    const {register, handleSubmit, formState} = form;
    const {errors} = formState;

    const submitHandler = (data:formData)=>{
        console.log(data);
    }
    return(
        <form onSubmit={handleSubmit(submitHandler)}>
            <input type="text" {...register("name",{required:{value:true,message:"name is required"}})} />
            <p className="text-red-600">{errors.name?.message}</p>
            <input type="email" {...register("email",{required:{value:true,message:"invalid email"}})} />
            <p className="text-red-600">{errors.email?.message}</p>
            <input type="number" {...register("phone",{required:{value:true,message:"phone number is required"}})} />
            <p className="text-red-600">{errors.phone?.message}</p>
            <button type="submit">Submit</button>
        </form>
    )
}

export default ReactHookForm;