const _ = require('lodash');

const self = {

    /**
     * Checks if a given path is a child path of another given path.
     * @param {string} target_path - The path to check if it is a child path.
     * @param {string} path - The parent path to check against.
     * @returns {boolean} - True if the target path is a child path of the given path, false otherwise.
     */
    isChildPath: (target_path, path) => {
        return _.startsWith(target_path, path + "/");
    },

    /**
     * Returns the parent path of a given path.
     * @param {string} path - The path to get the parent path of.
     * @returns {string} - The parent path of the given path.
     */
    getParentPath: (path) => {
        let split = path.split("/");
        return split.slice(0, split.length - 1).join("/");
    },

    /**
     * Generates a list of parent paths from a given object.
     * The function splits the input path by '/' and accumulates each parent path level.
     * For example, given '/a/b/c/d', it will return ['/a', '/a/b', '/a/b/c'].
     *
     * @param {string} path - The object path to process.
     * @returns {string[]} An array of parent paths, excluding the root and the last element.
     */
    getParentPathList: (path) => {
        let parents = [];
        let split = path.split('/');
        for (let i = 1; i < split.length - 1; i++) {
            parents.push(split.slice(0, i + 1).join('/'));
        }
        return parents;
    },

    /**
     * Finds the common parent of given targets by splitting them with a given delimiter and comparing the elements at each index.
     * @param {Array} target_list - List of targets to find common parent of.
     * @param {string} delimitor - Delimiter to split the targets with.
     * @returns {string} - The common parent of the given targets.
     */
    getTargetsCommonParent: (target_list, delimitor = '.') => {
        if (!target_list || target_list.length === 0) return "";
        let target_split_list = [], index = 0, common_parent = [], end = false;
        for (let target of target_list) {
            target_split_list.push(target.split(delimitor));
        }
        while (!end && index < target_split_list[0].length) {
            let ref = target_split_list[0][index];
            for (let i = 1; i < target_split_list.length; i++) {
                if (target_split_list[i].length < index || target_split_list[i][index] !== ref) {
                    end = true;
                    break;
                }
            }
            if (!end) {
                common_parent.push(ref);
            }
            index++;
        }
        return common_parent.join(delimitor);
    },

}

module.exports = self;