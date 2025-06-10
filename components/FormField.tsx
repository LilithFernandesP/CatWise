import React, { useState } from 'react'
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import Image from "next/image";

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: "text" | "password" | "email" | "file";
}

const FormField = <T extends FieldValues>({
                                              control,
                                              name,
                                              label,
                                              placeholder,
                                              type = 'text',
                                          }: FormFieldProps<T>) => {
    // Estado para armazenar o nome do arquivo selecionado
    const [fileName, setFileName] = useState<string>("");

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                if (type === 'file') {
                    return (
                        <FormItem>
                            <FormLabel className="label">{label}</FormLabel>
                            <FormControl>
                                <>
                                    <input
                                        id={name}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            field.onChange(file);
                                            setFileName(file?.name ?? "");
                                        }}
                                    />
                                    <label
                                        htmlFor={name}
                                        className="input flex items-center justify-center gap-4 cursor-pointer overflow-hidden max-w-["
                                    >
                                        <Image
                                            src="/upload.svg"
                                            alt="Upload"
                                            width={20}
                                            height={20}
                                            priority
                                        />
                                        <span className='text-textColor max-w-[200px] truncate'>{fileName || "Upload image"}</span>
                                    </label>
                                </>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }

                return (
                    <FormItem>
                        <FormLabel className="label">{label}</FormLabel>
                        <FormControl>
                            <Input
                                className="input"
                                placeholder={placeholder}
                                type={type}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
};

export default FormField;
