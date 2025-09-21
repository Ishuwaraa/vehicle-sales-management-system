import { useState, type ChangeEvent, type FormEvent } from "react";
import Navbar from "../components/shared/Navbar";
import Camera from "../assets/camera-icon.png";
import { useVehicleService } from "../services/vehicleService";
import type { AddVehicleRequest } from "../types/vehicle.types";
import { Edit, Sparkles } from "lucide-react";

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
    const [year, setYear] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

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
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    return ( 
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Vehicle</h1>
                </div>

                {/* Images Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Images</h3>
                    <div className="p-4">
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
                </div>

                <form onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Vehicle Details</h3>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter vehicle type" 
                                    value={vehicleType} 
                                    required 
                                    onChange={(e) => setVehicleType(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter vehicle brand" 
                                    value={brand} 
                                    required 
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Model Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter vehicle model name" 
                                    value={modelName} 
                                    required 
                                    onChange={(e) => setModelName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter vehicle color" 
                                    value={color} 
                                    required 
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Engine Size</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter vehicle engine size" 
                                    value={engineSize} 
                                    required 
                                    onChange={(e) => setEngineSize(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                <input 
                                    type="number" 
                                    placeholder="Enter vehicle year" 
                                    value={year} 
                                    required 
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs.)</label>
                                <input 
                                    type="number" 
                                    placeholder="Enter vehicle price" 
                                    value={price} 
                                    required 
                                    onChange={(e) => setPrice(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <button 
                                    type="button" 
                                    onClick={() => getAIDescription()}
                                    disabled={loading}
                                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium hover:cursor-pointer"
                                >
                                    <Sparkles className="h-4 w-4 mr-1" />
                                    {loading ? 'Generating...' : 'Generate AI Description'}
                                </button>
                            </div>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                required 
                                rows={4} 
                                placeholder="Vehicle description"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <button 
                            type="submit"
                            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Add Vehicle
                        </button>
                    </div>
                </form>
            </div>
        </div>
     );
}
 
export default AddVehicle;