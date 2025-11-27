interface SchemaOrgProps {
  data: any;
}

export default function SchemaOrg({ data }: SchemaOrgProps) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

