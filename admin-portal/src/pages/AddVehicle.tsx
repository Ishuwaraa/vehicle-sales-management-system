import { useState, type ChangeEvent, type FormEvent } from "react";
import Navbar from "../components/shared/Navbar";
import Camera from "../assets/camera-icon.png";
import { useVehicleService } from "../services/vehicleService";
import type { AddVehicleRequest } from "../types/vehicle.types";

interface ImageFile {
    file: File;
    preview: string;
}

const AddVehicle = () => {
    const vehicleService = useVehicleService();

    const [images, setImages] = useState<ImageFile[]>([]);
    const [vehicleType, setVehicleType] = useState<string>('');
    const [brand, setBrand] = useState<string>('');
    const [modelName, setModelName] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [engineSize, setEngineSize] = useState<string>('');
    const [year, setYear] = useState<number>();
    const [price, setPrice] = useState<number>();
    const [description, setDescription] = useState<string>('');

    const handleImageUpload = (setter: any, maxImages: number) => (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        const validFiles = files.filter(file => file.type.match('image.*'));
        if (validFiles.length !== files.length) {
            alert('Please select only image files');
            event.target.value = ''; // Reset the input field
            return;
        }

        const newImages: ImageFile[] = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setter((prevImages: ImageFile[]) => [...prevImages, ...newImages].slice(0, maxImages));
    };
    
    const removeImage = (setter: any) => (indexToRemove: number) => {
        setter((prevImages: ImageFile[]) => 
            prevImages.filter((_, index: number) => index !== indexToRemove)
        );
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (images.length < 4) {
            alert('All 4 images are required');
            return;
        }

        const formData = new FormData();
        formData.append('vehicleType', vehicleType);
        formData.append('brand', brand);
        formData.append('modelName', modelName);
        formData.append('color', color);
        formData.append('engineSize', engineSize);
        formData.append('year', year!.toString());
        formData.append('price', price!.toString());
        formData.append('description', description);

        images.forEach((image) => {
            formData.append('images', image.file);
        })

        try {
            const response = await vehicleService.addVehicle(formData);
            console.log(response);

            if (response.status !== 201) {
                alert('Error adding vehicle');
                return;
            }

            setImages([])
            setVehicleType('')
            setBrand('')
            setModelName('')
            setColor('')
            setEngineSize('')
            setYear(0)
            setPrice(0)
            setDescription('')
            alert('vehicle added successfully');
        } catch (err: any) {
            if (err.response.status === 500) {
                console.error(err.response?.data?.message)
            } else {
                console.error(err.message);
            }
        }
    }

    const getAIDescription = async () => {
        if (!vehicleType || !brand || !modelName || !color || !engineSize || !year || !price) {
            alert('All fields are required');
            return;
        }

        try {
            const data: Partial<AddVehicleRequest> = {
                vehicleType,
                brand,
                modelName,
                color,
                engineSize,
                year,
                price
            }
            const response = await vehicleService.generateAIDescription(data)
            
            if (response.status !== 200) {
                console.error(response.message);
                return;
            }

            setDescription(response.description!);
        } catch (err: any) {
            if (err.response.status === 500) {
                console.error(err.response?.data?.message)
            } else {
                console.error(err.message);
            }
        }
    }

    return ( 
        <>
        <Navbar />
        <div>
            <button onClick={() => getAIDescription()}>Generate Description</button>
        </div>

        <form onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}>
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Vehicle Images</h3>
                <div className="flex gap-2">
                {images.map((image, index) => (
                    <div key={index} className="relative w-32 h-32">
                    <img 
                        src={image.preview} 
                        className="w-full h-full object-cover rounded"
                    />
                    <button 
                        type="button"
                        onClick={() => removeImage(setImages)(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                        ×
                    </button>
                    </div>
                ))}

                {images.length < 4 && (
                    <label className="w-32 h-32 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                    <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload(setImages, 4)}
                    />
                    <img src={Camera} alt='camera' className='w-6 h-6'/>  
                    </label>
                )}
                </div>
            </div>

            <input type="text" placeholder="enter vehicle type" required onChange={(e) => setVehicleType(e.target.value)}/><br />
            <input type="text" placeholder="enter vehicle brand" required onChange={(e) => setBrand(e.target.value)}/><br />
            <input type="text" placeholder="enter vehicle model name" required onChange={(e) => setModelName(e.target.value)}/><br />
            <input type="text" placeholder="enter vehicle color" required onChange={(e) => setColor(e.target.value)}/><br />
            <input type="text" placeholder="enter vehicle engine size" required onChange={(e) => setEngineSize(e.target.value)}/><br />
            <input type="number" placeholder="enter vehicle year" required onChange={(e) => setYear(parseInt(e.target.value))}/><br />
            <input type="number" placeholder="enter vehicle price" required onChange={(e) => setPrice(parseInt(e.target.value))}/><br />

            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} placeholder="AI description"/><br />

            <button type="submit">Add Vehicle</button>
        </form>
        </>
     );
}
 
export default AddVehicle;