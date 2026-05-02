import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { itemVariants } from '@/utils/variants/itemVariants';
import { containerVariants } from '@/utils/variants/containerVariants';
import { Controller, useForm } from 'react-hook-form'
import { fieldVariants } from '@/utils/variants/fieldVariants';

export const CustomerRegistrationForm = () => {

  const { register, handleSubmit, formState: errors, control, watch } = useForm({
    defaultValues: {
      name: "",
      numberPhone: "",
      mail: "",
      direction: "",
      typeClient: "", 
      dui: "",
      nit: "",
      typeGiro: "",
      whitCreditFiscal: false
    
    }
  })
  console.log(errors)
  const isCreditFiscal = watch('whitCreditFiscal', false)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-8"
          variants={{ itemVariants }}
          initial="hidden"
          animate="visible"
        >
          Registro de cliente
        </motion.h1>

        {/* Main Card */}
        <motion.form
          onSubmit={handleSubmit(
            (data) => console.log("Éxito:", data),
            (err) => console.log("Errores de validación:", err)
          )}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="shadow-lg border-0 bg-white p-6 sm:p-8">
            {/* Section Header */}
            <motion.div variants={{ itemVariants }} className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6">
                DATOS DEL CLIENTE
              </h2>
            </motion.div>

            {/* Nombre Field */}
            <motion.div variants={{ itemVariants }} className="mb-6">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                Nombre:
              </Label>
              <Input
                {...register("name", { required: true })}
                id="name"
                type="text"
                placeholder="Ingrese el nombre del cliente"
                className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors rounded-md py-2 px-4"
              />
            </motion.div>

            {/* Phone and Email Row */}
            <motion.div
              variants={{ itemVariants }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            >
              <div>
                <Label
                  htmlFor="numberPhone"
                  className="text-sm font-semibold text-gray-700 mb-2 block"
                >
                  Número telefónico
                </Label>
                <Input
                  id="numberPhone"
                  {...register("numberPhone", { required: true })}
                  type="tel"
                  placeholder="+503 XXXX XXXX"
                  className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors rounded-md py-2 px-4"
                />
              </div>
              <div>
                <Label
                  htmlFor="mail"
                  className="text-sm font-semibold text-gray-700 mb-2 block"
                >
                  Correo electrónico
                </Label>
                <Input
                  id="mail"
                  {...register("mail", { required: true })}
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors rounded-md py-2 px-4"
                />
              </div>
            </motion.div>

            {/* Address Field */}
            <motion.div variants={{ itemVariants }} className="mb-6">
              <Label htmlFor="direction" className="text-sm font-semibold text-gray-700 mb-2 block">
                Dirección
              </Label>
              <Input
                id="direction"
                {...register("direction", { required: true })}
                type="text"
                placeholder="Ingrese la dirección del cliente"
                className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors rounded-md py-2 px-4"
              />
            </motion.div>

            {/* Customer Type Select */}
            <motion.div variants={{ itemVariants }} className="mb-6">
              <Label htmlFor="typeClient" className="text-sm font-semibold text-gray-700 mb-2 block">
                Tipo de cliente
              </Label>
              <Controller
                name="typeClient"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors rounded-md py-2 px-4">
                      <SelectValue placeholder="Seleccionar tipo de cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minorista">Minorista</SelectItem>
                      <SelectItem value="mayorista">Mayorista</SelectItem>
                      <SelectItem value="distribuidor">Distribuidor</SelectItem>
                      <SelectItem value="corporativo">Corporativo</SelectItem>
                    </SelectContent>
                  </Select>
                )} />


            </motion.div>

            {/* Tax Credit Toggle */}
            <motion.div variants={{ itemVariants }} className="flex items-center gap-4 mb-6 py-4">
              <Controller
                name="whitCreditFiscal"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-blue-500"
                  />
                )} />

              <Label htmlFor="creditoFiscal" className="text-gray-700 font-medium cursor-pointer">
                ¿Con Crédito Fiscal?
              </Label>
            </motion.div>

            {/* Conditional Fields - Tax Credit Section */}
            <AnimatePresence>
              {isCreditFiscal && (
                <motion.div
                  variants={{ fieldVariants }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="border-t-2 border-gray-200 pt-6"
                >
                  {/* DUI and NIT Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <motion.div variants={{ itemVariants }}>
                      <Label htmlFor="dui" className="text-sm font-semibold text-gray-700 mb-2 block">
                        DUI
                      </Label>
                      <Input
                        id="dui"
                        {...register("dui", { required: true })}
                        type="text"
                        placeholder="Ingrese el DUI"
                        className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors rounded-md py-2 px-4"
                      />
                    </motion.div>
                    <motion.div variants={{ itemVariants }}>
                      <Label htmlFor="nit" className="text-sm font-semibold text-gray-700 mb-2 block">
                        NIT
                      </Label>
                      <Input
                        id="nit"
                        {...register("nit", { required: true })}
                        type="text"
                        placeholder="Ingrese el NIT"
                        className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors rounded-md py-2 px-4"
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={{ itemVariants }}>
                    <Label htmlFor="tipoGiro" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Tipo de giro
                    </Label>
                    <Controller
                      name='typeGiro'
                      control={control}
                      rules={{ required: true }}
                      render={(({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors rounded-md py-2 px-4">
                            <SelectValue placeholder="Seleccionar tipo de giro" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comercio">Comercio</SelectItem>
                            <SelectItem value="servicios">Servicios</SelectItem>
                            <SelectItem value="manufactura">Manufactura</SelectItem>
                            <SelectItem value="importacion">Importación</SelectItem>
                            <SelectItem value="exportacion">Exportación</SelectItem>
                          </SelectContent>
                        </Select>
                      ))}
                    />


                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Submit Button */}
          <motion.div
            variants={{ itemVariants }}
            className="mt-8 flex justify-start"
          >
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Registrar
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div >
  );
}
