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
    const spelQuery = formatQuery(newQuery, 'spel');
    updateQuery(spelQuery);
  };
  console.log(formatQuery(query, 'sql'))
  return (
    <div className='overflow-auto'>
       <QueryBuilder controlClassnames={{ queryBuilder: 'queryBuilder-branches ruleGroup-body' }} fields={fields} query={query} onQueryChange={handleQueryChange} />
    </div>
  )
}

export default QueryBuilderPanel