import React, { useEffect } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { MdExpandMore, MdChevronRight, MdCheckBox, MdCheckBoxOutlineBlank, MdIndeterminateCheckBox } from 'react-icons/md';

const Tree = ({ checked, jsonData, expanded, setExpanded, setChecked, updateEditorVal }) => {
    const getAllPaths = (obj, path = '') => {
        return Object.keys(obj).flatMap((key) => {
            const currentPath = path ? `${path}.${key}` : key;
            return typeof obj[key] === 'object' && obj[key] !== null
                ? [currentPath, ...getAllPaths(obj[key], currentPath)]
                : currentPath;
        });
    };

    useEffect(() => {
        const paths = getAllPaths(jsonData);
        setChecked(paths);
        setExpanded(paths);
    }, [jsonData, setChecked, setExpanded]);

    const jsonToTreeNodes = (obj, path = '') => {
        return Object.keys(obj).map((key) => {
            const currentPath = path ? `${path}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                return {
                    value: currentPath,
                    label: key,
                    children: jsonToTreeNodes(obj[key], currentPath)
                };
            } else {
                return { value: currentPath, label: key };
            }
        });
    };

    const filterJsonData = (data, paths) => {
        const filteredData = {};
        paths.forEach((path) => {
            const keys = path.split('.');
            let current = filteredData;
            let jsonDataCurrent = data;
            keys.forEach((key, index) => {
                if (jsonDataCurrent[key] !== undefined) {
                    if (index === keys.length - 1) {
                        current[key] = jsonDataCurrent[key];
                    } else {
                        current[key] = current[key] || {};
                        current = current[key];
                        jsonDataCurrent = jsonDataCurrent[key];
                    }
                }
            });
        });
        return filteredData;
    };

    const updateEditorWithSelectedFields = (checkedNodes) => {
        const filteredData = filterJsonData(jsonData, checkedNodes);
        updateEditorVal(filteredData);
    };

    const treeNodes = jsonToTreeNodes(jsonData);

    return (
        <CheckboxTree
            nodes={treeNodes}
            checked={checked}
            expanded={expanded}
            onCheck={(checked) => {
                setChecked(checked);
                updateEditorWithSelectedFields(checked);
            }}
            onExpand={(expanded) => setExpanded(expanded)}
            icons={{
                check: <MdCheckBox />,
                uncheck: <MdCheckBoxOutlineBlank />,
                halfCheck: <MdIndeterminateCheckBox />,
                expandClose: <MdChevronRight />,
                expandOpen: <MdExpandMore />,
            }}
        />
    );
};

export default Tree;