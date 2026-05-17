import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "react-toastify";
import { nehnutelnostiService } from "../../services/nehnutelnostiService";
import FormInput from "../../components/forms/FormInput";
import FormSelect from "../../components/forms/FormSelect";
import FormCheckbox from "../../components/forms/FormCheckbox";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ControlledInput from "../../components/forms/ControlledInput";

const locationSchema = z.object({
  street: z.string().min(1, "Ulica je povinná"),
  houseNumber: z.string().optional(),
  apartment: z.string().optional(),
  city: z.string().min(1, "Mesto je povinné"),
  postalCode: z.string().min(1, "PSČ je povinné"),
  country: z.string().min(1, "Krajina je povinná"),
});

const optionalNum = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(v)),
  z.number().min(0).optional(),
);

const optionalYear = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(v)),
  z.number().min(1900).max(new Date().getFullYear()).optional(),
);

const unifiedSchema = z.object({
  title: z.string().min(2, "Názov musí byť aspoň 2 znaky"),
  desc: z.string().min(5, "Popis musí mať aspoň 5 znakov"),
  type: z.enum(["byt", "dom", "pozemok"]),
  state: z.enum(["predaj", "prenajom"]),
  price: z.coerce.number().positive("Cena musí byť kladné číslo"),
  area: z.coerce.number().positive("Plocha musí byť kladné číslo"),
  location: locationSchema,

  rooms: optionalNum,
  bathrooms: optionalNum,
  hasGarage: z.boolean().optional(),
  hasBalcony: z.boolean().optional(),
  hasTerrace: z.boolean().optional(),
  hasElevator: z.boolean().optional(),
  floor: optionalNum,
  totalFloors: optionalNum,
  constructionYear: optionalYear,
  renovationYear: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().min(1900).optional(),
  ),
  energyClass: z.string().optional(),
  heatingType: z.string().optional(),
  condition: z.string().optional(),

  landType: z.string().optional(),
  isFenced: z.boolean().optional(),
  hasUtilities: z.boolean().optional(),
  utilitiesTypes: z.array(z.string()).optional(),
  terrainType: z.string().optional(),
});

type FormData = z.infer<typeof unifiedSchema>;

type ImagePreview = {
  file: File;
  preview: string;
};

const theme = createTheme({
  palette: { primary: { main: "#1976d2" } },
});

const steps = [
  { label: "Základné informácie" },
  { label: "Adresa" },
  { label: "Detailné informácie" },
  { label: "Obrázky" },
];

function RealityFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<ImagePreview[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    control,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(unifiedSchema),
    mode: "onChange",
    defaultValues: {
      type: "byt",
      state: "predaj",
      hasGarage: false,
      hasBalcony: false,
      hasTerrace: false,
      hasElevator: false,
      isFenced: false,
      hasUtilities: false,
      location: {
        street: "",
        houseNumber: "",
        apartment: "",
        city: "",
        postalCode: "",
        country: "Slovensko",
      },
    },
  });

  const watchedType = useWatch({ control, name: "type" });
  const isLandType = watchedType === "pozemok";

  useEffect(() => {
    if (!isEditMode || !id) return;

    nehnutelnostiService
      .getById(id)
      .then((reality) => {
        reset({
          title: reality.title,
          desc: reality.desc,
          price: reality.price,
          area: reality.area,
          state: reality.state as any,
          type: reality.type as any,
          location: reality.location,
          rooms: reality.rooms ?? undefined,
          bathrooms: reality.bathrooms ?? undefined,
          hasGarage: reality.hasGarage ?? false,
          hasBalcony: reality.hasBalcony ?? false,
          hasTerrace: reality.hasTerrace ?? false,
          hasElevator: reality.hasElevator ?? false,
          floor: reality.floor ?? undefined,
          totalFloors: reality.totalFloors ?? undefined,
          constructionYear: reality.constructionYear ?? undefined,
          renovationYear: reality.renovationYear ?? undefined,
          energyClass: reality.energyClass ?? undefined,
          heatingType: reality.heatingType ?? undefined,
          condition: reality.condition ?? undefined,
          landType: reality.landType ?? undefined,
          isFenced: reality.isFenced ?? false,
          hasUtilities: reality.hasUtilities ?? false,
          terrainType: reality.terrainType ?? undefined,
        });
        setExistingImages(reality.images ?? []);
      })
      .catch((error) => {
        console.error("Chyba pri načítaní:", error);
        toast.error("Nepodarilo sa načítať nehnuteľnosť");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const compressImage = (file: File, maxSizeMB = 2): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_DIM = 1920;
          let { width, height } = img;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);

          let quality = 0.85;
          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) return resolve(file);
                if (blob.size > maxSizeMB * 1024 * 1024 && quality > 0.3) {
                  quality -= 0.1;
                  tryCompress();
                } else {
                  resolve(
                    new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                      type: "image/jpeg",
                      lastModified: Date.now(),
                    }),
                  );
                }
              },
              "image/jpeg",
              quality,
            );
          };
          tryCompress();
        };
        img.src = e.target!.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleNext = async () => {
    let isValid = false;

    if (activeStep === 0) {
      isValid = await trigger([
        "title",
        "desc",
        "price",
        "area",
        "type",
        "state",
      ]);
      if (!isValid) {
        toast.error("Vyplňte prosím všetky povinné polia");
        return;
      }
    } else if (activeStep === 1) {
      isValid = await trigger([
        "location.street",
        "location.city",
        "location.postalCode",
        "location.country",
      ]);
      if (!isValid) {
        toast.error("Vyplňte prosím všetky povinné polia adresy");
        return;
      }
    } else if (activeStep === 2) {
      if (watchedType !== "pozemok") {
        isValid = await trigger(["rooms"]);
      } else {
        isValid = await trigger(["landType"]);
      }
      if (!isValid) {
        toast.error("Vyplňte prosím povinné polia");
        return;
      }
    } else {
      isValid = true;
    }

    console.log("Aktuální data před přechodem na další krok:", getValues());

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews: ImagePreview[] = await Promise.all(
      files.map(async (file) => {
        const compressed = await compressImage(file, 2);
        return { file: compressed, preview: URL.createObjectURL(compressed) };
      }),
    );
    setNewImages((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImages[index].preview);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl: string) => {
    setImagesToDelete((prev) => [...prev, imageUrl]);
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("desc", data.desc);
      formData.append("price", String(data.price));
      formData.append("area", String(data.area));
      formData.append("type", data.type);
      formData.append("state", data.state);
      formData.append("location", JSON.stringify(data.location));

      console.log("FormData před odesláním:", data);

      if (data.type !== "pozemok") {
        if (data.rooms != null) formData.append("rooms", String(data.rooms));
        if (data.bathrooms != null)
          formData.append("bathrooms", String(data.bathrooms));
        formData.append("hasGarage", data.hasGarage ? "true" : "false");
        formData.append("hasBalcony", data.hasBalcony ? "true" : "false");
        formData.append("hasTerrace", data.hasTerrace ? "true" : "false");
        formData.append("hasElevator", data.hasElevator ? "true" : "false");
        if (data.floor != null) formData.append("floor", String(data.floor));
        if (data.totalFloors != null)
          formData.append("totalFloors", String(data.totalFloors));
        if (data.constructionYear != null)
          formData.append("constructionYear", String(data.constructionYear));
        if (data.renovationYear != null)
          formData.append("renovationYear", String(data.renovationYear));
        if (data.energyClass) formData.append("energyClass", data.energyClass);
        if (data.heatingType) formData.append("heatingType", data.heatingType);
        if (data.condition) formData.append("condition", data.condition);
      } else {
        if (data.landType) formData.append("landType", data.landType);
        formData.append("isFenced", data.isFenced ? "true" : "false");
        formData.append("hasUtilities", data.hasUtilities ? "true" : "false");
        if (data.terrainType) formData.append("terrainType", data.terrainType);
      }

      newImages.forEach((img) => formData.append("images", img.file));

      if (imagesToDelete.length > 0) {
        formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
      }

      if (isEditMode && id) {
        await nehnutelnostiService.update(id, formData);
        toast.success("Nehnuteľnosť bola úspešne upravená");
      } else {
        await nehnutelnostiService.create(formData);
        toast.success("Nehnuteľnosť bola úspešne vytvorená");
      }

      navigate("/reality");
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(`Chyba: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Načítavam...</Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="md"
        sx={{
          py: { xs: 2, sm: 4 },
          mt: { xs: "4rem", sm: "5rem" },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: { xs: 2, sm: 4 }, borderRadius: { xs: 2, sm: 3 } }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {isEditMode ? "Upraviť nehnuteľnosť" : "Pridať novú nehnuteľnosť"}
          </Typography>

          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              flexWrap: { xs: "wrap", sm: "nowrap" },
              "& .MuiStepLabel-label": {
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
                display: { xs: "none", sm: "block" },
              },
            }}
          >
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* ── KROK 1: Základné informácie ── */}
          <Box sx={{ display: activeStep === 0 ? "block" : "none" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontSize: { xs: "1rem", sm: "1.25rem" },
                mb: { xs: 1, sm: 2 },
              }}
            >
              Základné informácie
            </Typography>

            <ControlledInput
              name="title"
              label="Názov"
              type="text"
              control={control}
              required
            />
            <ControlledInput
              label="Popis"
              name="desc"
              type="text"
              control={control}
              multiline
              rows={4}
              required
            />

            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 2 },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <FormSelect
                  label="Typ nehnuteľnosti"
                  name="type"
                  control={control}
                  options={[
                    { value: "byt", label: "Byt" },
                    { value: "dom", label: "Dom" },
                    { value: "pozemok", label: "Pozemok" },
                  ]}
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormSelect
                  label="Stav"
                  name="state"
                  control={control}
                  options={[
                    { value: "predaj", label: "Predaj" },
                    { value: "prenajom", label: "Prenájom" },
                  ]}
                  required
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 2 },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <FormInput
                  label="Cena (€)"
                  name="price"
                  type="number"
                  register={register}
                  error={errors.price}
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormInput
                  label="Plocha (m²)"
                  name="area"
                  type="number"
                  register={register}
                  error={errors.area}
                  required
                />
              </Box>
            </Box>
          </Box>

          {/* ── KROK 2: Adresa ── */}
          <Box sx={{ display: activeStep === 1 ? "block" : "none" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontSize: { xs: "1rem", sm: "1.25rem" },
                mb: { xs: 1, sm: 2 },
              }}
            >
              Adresa
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 2 },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ flex: 2 }}>
                <FormInput
                  type="text"
                  label="Ulica"
                  name="location.street"
                  register={register}
                  error={(errors as any).location?.street}
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormInput
                  type="text"
                  label="Číslo domu"
                  name="location.houseNumber"
                  register={register}
                />
              </Box>
            </Box>

            <FormInput
              type="text"
              label="Číslo bytu"
              name="location.apartment"
              register={register}
            />

            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 2 },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <FormInput
                  type="text"
                  label="Mesto"
                  name="location.city"
                  register={register}
                  error={(errors as any).location?.city}
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormInput
                  type="text"
                  label="PSČ"
                  name="location.postalCode"
                  register={register}
                  error={(errors as any).location?.postalCode}
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormInput
                  type="text"
                  label="Krajina"
                  name="location.country"
                  register={register}
                  error={(errors as any).location?.country}
                  required
                />
              </Box>
            </Box>
          </Box>

          {/* ── KROK 3: Detailné informácie ── */}
          <Box sx={{ display: activeStep === 2 ? "block" : "none" }}>
            {!isLandType ? (
              <>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    mb: { xs: 1, sm: 2 },
                  }}
                >
                  Detailné informácie
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 1, sm: 2 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <FormInput
                      type="number"
                      label="Počet izieb"
                      name="rooms"
                      register={register}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormInput
                      type="number"
                      label="Počet kúpeľní"
                      name="bathrooms"
                      register={register}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 1, sm: 2 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <FormInput
                      type="number"
                      label="Poschodie"
                      name="floor"
                      register={register}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormInput
                      type="number"
                      label="Celkový počet poschodí"
                      name="totalFloors"
                      register={register}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 1, sm: 2 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <FormInput
                      type="number"
                      label="Rok výstavby"
                      name="constructionYear"
                      register={register}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormInput
                      type="text"
                      label="Typ kúrenia"
                      name="heatingType"
                      register={register}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                  <FormCheckbox
                    label="Garáž"
                    name="hasGarage"
                    control={control}
                  />
                  <FormCheckbox
                    label="Balkón"
                    name="hasBalcony"
                    control={control}
                  />
                  <FormCheckbox
                    label="Terasa"
                    name="hasTerrace"
                    control={control}
                  />
                  <FormCheckbox
                    label="Výťah"
                    name="hasElevator"
                    control={control}
                  />
                </Box>
              </>
            ) : (
              <>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    mb: { xs: 1, sm: 2 },
                  }}
                >
                  Informácie o pozemku
                </Typography>

                <FormInput
                  type="text"
                  label="Typ pozemku"
                  name="landType"
                  register={register}
                />
                <FormInput
                  type="text"
                  label="Typ terénu"
                  name="terrainType"
                  register={register}
                />

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                  <FormCheckbox
                    label="Oplotené"
                    name="isFenced"
                    control={control}
                  />
                  <FormCheckbox
                    label="Privedené inžinierske siete"
                    name="hasUtilities"
                    control={control}
                  />
                </Box>
              </>
            )}
          </Box>

          {/* ── KROK 4: Obrázky ── */}
          <Box sx={{ display: activeStep === 3 ? "block" : "none" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontSize: { xs: "1rem", sm: "1.25rem" },
                mb: { xs: 1, sm: 2 },
              }}
            >
              Obrázky
            </Typography>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ marginBottom: "1rem", width: "100%" }}
            />

            {isEditMode && existingImages.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Existujúce obrázky:
                </Typography>
                <Box sx={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {existingImages.map((img, i) => (
                    <Box key={i} sx={{ position: "relative" }}>
                      <img
                        src={`http://localhost:3000${img}`}
                        alt={`foto ${i + 1}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{ position: "absolute", top: -8, right: -8 }}
                        onClick={() => removeExistingImage(img)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {newImages.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Nové obrázky:
                </Typography>
                <Box sx={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {newImages.map((img, i) => (
                    <Box key={i} sx={{ position: "relative" }}>
                      <img
                        src={img.preview}
                        alt={`náhľad ${i + 1}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{ position: "absolute", top: -8, right: -8 }}
                        onClick={() => removeNewImage(i)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* ── Navigačné tlačidlá ── */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              flexDirection: { xs: "column-reverse", sm: "row" },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Späť
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                className="styled-button"
                variant="contained"
                color="primary"
                onClick={() => {
                  console.log("Errors:", errors);
                  handleSubmit(onSubmit)();
                }}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                {isEditMode ? "Uložiť zmeny" : "Pridať inzerát"}
              </Button>
            ) : (
              <Button
                className="styled-button"
                variant="contained"
                onClick={handleNext}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Pokračovať
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default RealityFormPage;
