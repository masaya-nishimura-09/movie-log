"use client";

import { useSearchParams } from "next/navigation";
import { SearchForm } from "@/components/molecules/search-form";
import { recordQueryKeys } from "@/lib/record/parse-record-query";

type RecordSearchFormProps = {
  action: string;
  label: string;
  placeholder: string;
};

export function RecordSearchForm(props: RecordSearchFormProps) {
  const keyword = useSearchParams().get(recordQueryKeys.keyword) ?? "";

  return (
    <SearchForm {...props} name={recordQueryKeys.keyword} keyword={keyword} />
  );
}
