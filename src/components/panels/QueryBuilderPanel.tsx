import { useState } from 'react';
import { Field, QueryBuilder, RuleGroupType, formatQuery } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';


interface QueryProps {
  fields: Field[];
  updateQuery: (newQuery: string) => void;
}

const QueryBuilderPanel:React.FC<QueryProps> = ({fields, updateQuery}) => {
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: 'and',
    rules: [
    ],
  });

  const handleQueryChange = (newQuery: RuleGroupType) => {
    setQuery(newQuery);
    const sqlQuery = formatQuery(newQuery, 'spel');
    updateQuery(sqlQuery); // Llama a la función de actualización con la nueva query SQL
  };
  console.log(formatQuery(query, 'sql'))
  return (
    <div>
       <QueryBuilder controlClassnames={{ queryBuilder: 'queryBuilder-branches ruleGroup-body' }} fields={fields} query={query} onQueryChange={handleQueryChange} />
    </div>
  )
}

export default QueryBuilderPanel