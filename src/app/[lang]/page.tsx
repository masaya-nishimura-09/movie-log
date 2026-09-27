import { redirect } from "next/navigation";
import { getLocale } from "@/i18n/get-dictionary";

export default async function Page() {
  redirect(`/${await getLocale()}/records`);
}
